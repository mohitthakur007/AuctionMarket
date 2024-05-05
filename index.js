const express = require('express')
const jwt = require('jsonwebtoken');

const app = express()
const port = 3000
app.use(express.json());
const secretKey = "TOKEN_SECRET";

let users = [];
let admins = [];
let products = [];

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

app.get('/ulog-in', (req, res) => {
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
        const newUser = {username, password};
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
        const newAdmin = {username, password};
        admins.push(newAdmin);
        const token = generateAccessToken({ username: req.body.username });
        res.json({message: "admin created successfully and logged in", token});
    }
  });
  
// server code

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

