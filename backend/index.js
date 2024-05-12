const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const mongoose  = require("mongoose");

const app = express()
const port = 3000
app.use(express.json());
app.use(cors());
const secretKey = "TOKEN_SECRET";



const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const postsSchema = new mongoose.Schema({
  name: String,
  desc: String,
  qty: Number,
  unit: String,
  photoURL: String,
  minPrice: Number,
  finalPrice: Number,
  bidsReceived: [{ amount:Number, createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' } }],
  status: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});


const Users = mongoose.model('User', userSchema);
const Admins = mongoose.model('Admin', adminSchema);
const Posts = mongoose.model('Posts', postsSchema);



mongoose.connect('mongodb+srv://marketauctionmongo:12345@cluster0.hyd5vhn.mongodb.net/MarketAuction', { useNewUrlParser: true, useUnifiedTopology: true});

// , dbName: "courses" 
/*
functions
*/
function generateAccessToken(username) {
    return jwt.sign(username, secretKey, { expiresIn: '1800s' });
}

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };


/*
user routes
*/

app.get('/ulanding-page', authenticateJwt, (req, res) => {
  res.send('Hello World User!')
})

app.post('/ulog-in', async(req, res) => {
    const {username, password} = req.body;
    const user = await Users.findOne({username, password});
    if(user){
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "user logged in..", token});
    } else {
        res.status(403).json({message:"username or password incorrect"});
    }
    
});

app.post('/usign-up', async(req, res) => {
    const {username, password} = req.body;
    const user = await Users.findOne({username});
    console.log(user);
    if(user){
        res.status(403).json({message: "username already exist"});
    } else {
        const newUser = {username, password};
        Users.create(newUser);
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "user created successfully and logged in", token});
    }
});

app.get('/ume', authenticateJwt, (req, res) => {
  res.json({username: req.user.username});
})

/*
admin routes
*/

app.get('/alanding-page', authenticateJwt, (req, res) => {
    res.send('Hello World Admin!')
  })
  
  app.post('/alog-in', async (req, res) => {
    const {username, password} = req.body;
    const admin = await Admins.findOne({username, password});
    if(admin){
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "admin logged in",token});
    } else {
        res.status(403).json({message:"username or password incorrect"});
    }
  })
  
  app.post('/asign-up', async (req, res) => {
    const {username, password} = req.body;
    const admin = await Admins.findOne({username});
    if(admin){
        res.status(403).json({message: "username already exist"});
    } else {
        const newAdmin = {username, password};
        Admins.create(newAdmin);
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "admin created successfully and logged in", token});
    }
  });

  //CRUD A POST BY ADMIN
// POST endpoint for creating a new post
app.post('/post/create', authenticateJwt, async (req, res) => {
  const { name, desc, qty, unit, photoURL, minPrice } = req.body;
  const user = await Users.findOne({username: req.user.username});
  if (name && desc && qty && unit && photoURL && minPrice) {
    const newPost = {
      name,
      desc,
      qty: parseInt(qty),
      unit,
      photoURL,
      minPrice: parseInt(minPrice),
      finalPrice: 0,
      bidsReceived: [],
      status: "CREATED",
      createdBy: user.id
    };
    const postCreated = await Posts.create(newPost);
    res.status(201).json({ message: "Post created successfully", id: postCreated.id });
  } else {
    res.status(400).json({ error: "All mandatory fields are required: name, desc, qty, unit, photoURL, minPrice" });
  }
});

// GET endpoint to fetch a specific post by ID
app.get('/post/get/:id', authenticateJwt, async(req, res) => {
  const id = req.params.id;
  const post = await Posts.findById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// GET endpoint to fetch all posts
app.get('/post/get', authenticateJwt, async(req, res) => {
  const result = await Posts.find({});
  res.status(200).json(result);
});

// PATCH endpoint to update a post by ID
app.patch('/post/update/:id', authenticateJwt, async (req, res) => {
  const id = req.params.id;
  const { name, desc, qty, unit, photoURL, minPrice } = req.body;
  const post = await Posts.findById(id);

  if (post) {
    // Update only the provided fields
    if (name) post.name = name;
    if (desc) post.desc = desc;
    if (qty) post.qty = qty;
    if (unit) post.unit = unit;
    if (photoURL) post.photoURL = photoURL;
    if (minPrice) post.minPrice = minPrice;
    Posts.findByIdAndUpdate(id, post);
    res.status(200).json({ message: "Post updated successfully", updatedPost: post});
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// DELETE endpoint to delete a post by ID
app.delete('/post/delete/:id', authenticateJwt, async(req, res) => {
  const id = req.params.id;
  const post = await Posts.findById(id);
  if (post) {
    Posts.deleteOne(post);
    res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

//Create a bidding on a post
app.post('/bid/create', authenticateJwt, async (req, res) => {
  const { postId, amount } = req.body;
  const user = await Users.findOne({ username: req.user.username });
  const post = await Posts.findById(postId);

  if (post && post.minPrice < amount) {
    const newBid = {
      createdBy: user.id,
      amount
    };
    
    
    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { $push: { bidsReceived: newBid } },
      { new: true } 
    );

    if (updatedPost) {
      const newBidId = updatedPost.bidsReceived[updatedPost.bidsReceived.length - 1]._id;

      res.status(200).json({ message: "Bid created successfully" , bidId:newBidId });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } else {
    res.status(400).json({ error: "Post not found or bidding amount too low" });
  }
});

//Sell an item to a particular bidder
app.post('/post/sell', authenticateJwt, async(req, res) => {
  const { postId, bidId} = req.body;
  const user = await Users.findOne({username: req.user.username})
  const post= await Posts.findById(postId);
  if(post.createdBy == user.id){
    const bid = post.bidsReceived.find(a => a.id == bidId)
    if(bid){
      post.status = "SOLD";
      user.purchasedProducts.push(post.id);
      Users.findByIdAndUpdate(user.id, user);
      Posts.findByIdAndUpdate(post.id, post);
      res.status(200).json({ message: "Product sold successfully"});
    } else {
      res.status(403).json({ error: "No bids found from this bidder on this product" });
    }
  } else {
    res.status(403).json({ error: "You cannot sell others product" });
  }
});

// server code

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

