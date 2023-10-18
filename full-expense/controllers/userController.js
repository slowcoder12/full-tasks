const User = require('../models/user');

const bcrypt = require('bcrypt');


exports.addUser = (req,res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password,10,(err,hash)=>{
        if(err){
            console.error("error",err)
            res.status(500).json({message: "error during hashing"})
        }
    
    User.create({
        name: name,
        email: email,
        password: hash,
    })
    .then(result => {
        console.log("user added");
        res.status(200).json({ message: "User added successfully" });
    })
    .catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log("duplicate entry, email already used");
            res.status(400).json({ message: "Email already in use" });
        } else {
            console.log("error in adding user", err);
            res.status(500).json({ message: "Error in adding user" });
        }
        })
    });
};

exports.loginUser = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        attributes:['email','password'],
        where:{
            email:email
        }
    }).then(user=>{
        if(!user){
            console.log(user);
            res.status(404).json({message: "User not found, please sign up"});
            
        }
        else{
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: "Error during (camparing) login" });
                } else if (result) {
                    console.log(user.password);
                    res.status(200).json({ message: "User exists" });
                } else {
                    res.status(401).json({ message: "User not authorized" });
                }
            });
        }
    }).catch(err => {
        console.log(err);
    });
};







