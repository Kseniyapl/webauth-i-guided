const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  let user = req.body;

 
  //the password has to be hashed

  //1. hash the passowrd (using bcrypt)
const hash = bcrypt.hashSync(user.password, 10)

  //2. replace the eeal password with hash
  user.password = hash;


  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;
//check if username is valid
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {//real password and the hash in db, matched the data
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


function restricted(req, res, next){ 
const {username, password } = req.headers;
if (username && password) {
    Users.findBy({username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)){
        next();

      }else{
    res.status(401).json({message:'invalid password'})

      }
    })
    .catch(err =>{
      res.status(500).json(eer);
    })
   }else{
res.status(400).json({message:'Missing credentials'})
    }
};


server.get('/api/users', restricted, (req, res) => {

  //we should only send the master list of users if username and password is valid combo
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = process.env.PORT || 9090;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));


//encryption
//pass1234 -> {key) -> jhkdfhgkdjh
//jhkdfhgkdjh -> {key) -> pass1234

//hashing (non reversible)
//pass 1234 -> jfsjfdl345 can not reverse back

//hash is not a secret, bot  can create dictionary 

const bruteforce = {

  'aaaa':'fklsd',
  'aaab':'sdfsdf',
  'aaac':'kjfjsdk',
}
const dictionary ={
  'password':'jsdfj',
  'password1':'kjsdfskd'
}

//hash algorithm takes 1 sec to hash
//hash algorithm takes 5 secs to hash

// salt
//pass1234
// step 1: kldjflsdjfls(salt: kjdslfjs);  2^10 = 30589 times
// step 2: jdsfljsdljf -> jdfsdjflskdjf;
// strp 3: kfkljdfsdfj-> kljflsdjklsjdf;
// trep 4: fksdlfkjsd-> ksjdlfkjsldkj;
