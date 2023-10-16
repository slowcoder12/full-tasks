const User = require('../models/user');

exports.addUser = (req,res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;


    User.create({
        name: name,
        email: email,
        password: password,
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
    });
};

