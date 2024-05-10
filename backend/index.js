const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express()
const port = 3000
app.use(express.json());
app.use(cors());
const secretKey = "TOKEN_SECRET";

let users = [];
let admins = [];
let posts = [];

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

app.post('/ulog-in', (req, res) => {
    const {username, password} = req.body;
    const user = users.find(a=> a.username===username && a.password===password)
    if(user){
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "user logged in..",token});
    } else {
        res.status(403).json({message:"username or password incorrect"});
    }
    
})

app.post('/usign-up', (req, res) => {
    const {username, password} = req.body;
    const user = users.find(a=> a.username===username)
    if(user){
        res.status(403).json({message: "username already exist"});
    } else {
        const newUser = {id: users.length+1, username, password};
        users.push(newUser);
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "user created successfully and logged in", token});
    }
});

/*
admin routes
*/

app.get('/alanding-page', authenticateJwt, (req, res) => {
    res.send('Hello World Admin!')
  })
  
  app.get('/alog-in', (req, res) => {
    const admin = admins.find(a=> a.username===username && a.password===password)
    if(admin){
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "admin logged in",token});
    } else {
        res.status(403).json({message:"username or password incorrect"});
    }
  })
  
  app.post('/asign-up', (req, res) => {
    const {username, password} = req.body;
    const admin = admins.find(a=> a.username===username)
    if(admin){
        res.status(403).json({message: "username already exist"});
    } else {
        const newAdmin = {id: admins.length+1, username, password};
        admins.push(newAdmin);
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "admin created successfully and logged in", token});
    }
  });

  //CRUD A POST BY ADMIN
// POST endpoint for creating a new post
app.post('/post/create', authenticateJwt, (req, res) => {
  const { name, desc, qty, unit, photoURL, minPrice } = req.body;

  if (name && desc && qty && unit && photoURL && minPrice) {
    const newPost = {
      id: posts.length+1,
      name,
      desc,
      qty,
      unit,
      photoURL,
      minPrice,
      finalPrice: 0,
      bidsReceived: [],
      status: "CREATED"
    };
    posts.push(newPost);
    res.status(201).json({ message: "Post created successfully", id: newPost.id });
  } else {
    res.status(400).json({ error: "All mandatory fields are required: name, desc, qty, unit, photoURL, minPrice" });
  }
});

// GET endpoint to fetch a specific post by ID
app.get('/post/get/:id', authenticateJwt, (req, res) => {
  const id = req.params.id;
  const post = posts.find(a => id === a.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// GET endpoint to fetch all posts
app.get('/post/get', authenticateJwt, (req, res) => {
  res.status(200).json(posts);
});

// PATCH endpoint to update a post by ID
app.patch('/post/update/:id', authenticateJwt, (req, res) => {
  const id = req.params.id;
  const { name, desc, qty, unit, photoURL, minPrice } = req.body;
  const postIndex = posts.findIndex(post => post.id === id);

  if (postIndex !== -1) {
    // Update only the provided fields
    if (name) posts[postIndex].name = name;
    if (desc) posts[postIndex].desc = desc;
    if (qty) posts[postIndex].qty = qty;
    if (unit) posts[postIndex].unit = unit;
    if (photoURL) posts[postIndex].photoURL = photoURL;
    if (minPrice) posts[postIndex].minPrice = minPrice;

    res.status(200).json({ message: "Post updated successfully", updatedPost: posts[postIndex] });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// DELETE endpoint to delete a post by ID
app.delete('/post/delete/:id', authenticateJwt, (req, res) => {
  const id = req.params.id;
  const postIndex = posts.findIndex(post => post.id === id);

  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

//Create a bidding on a post
app.post('/bid/create', authenticateJwt, (req, res) => {
  const { postId, amount} = req.body;
  const user = users.find(a=> a.username===req.user.username)
  const post= posts.find(a=> a.id===postId);
  if (post && post.minPrice < amount) {
    const newBid = {
      createdBy: user.id ,
      amount
    };
    post.bidsReceived.push(newBid);
    res.status(200).json({ message: "Bid created successfully"});
  } else {
    res.status(400).json({ error: "Post not found or bidding amount too less!!" });
  }
});

//Sell an item to a particular bidder
app.post('/post/sell', authenticateJwt, (req, res) => {
  const { postId, amount, bidderId} = req.body;
  const user = users.find(a=> a.username===req.user.username)
  const post= posts.find(a=> a.id===postId);
  if(post.createdBy===user.id){
    const bid = post.bidsReceived.find(a => a.createdBy===bidderId)
    if(bid){
      post.status = "SOLD";
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

