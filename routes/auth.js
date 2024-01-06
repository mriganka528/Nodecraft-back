const express = require('express');
const User = require('../models/User');
//Used for validation
const { body, validationResult } = require('express-validator');
//used for hashing a password
var bcrypt = require('bcryptjs');
const router = express.Router();
//used for sending tokens
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleWare/fetchUser');
const JWT_SECRET = "helloMyselfMriganka";

//create a user using POST: "/api/auth/createUser"
router.post('/createUser', [
    body('name', 'Enter a valied name..').isLength({ min: 3 }),
    body('email', 'Enter a valied email...').isEmail(),
    body('password', 'Password is not secure...').isLength({ min: 6 })
], async (req, res) => {
    console.log(req.body);
    let success=false;
    const result = validationResult(req);
    //will do if Validation Result is Empty,
    if (result.isEmpty()) {
        //Save data to the database
        // const user = User(req.body);
        // user.save();
        //Or WE CAN ADD DATA TO database this way
        try {
            const salt = await bcrypt.genSaltSync(10);
            const secure_psd = await bcrypt.hashSync(req.body.password, salt);
            const user = await User.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: secure_psd
                }
            )
            const data =
            {
                user:
                {
                    id: user.id
                }
            }
            const auth_Token = jwt.sign(data, JWT_SECRET);
            success=true;
            res.json({ success, auth_Token });


            //Will Execute this part if Email is already exist
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ success, error: "A user with this email already exist" });
            } else {
                console.log(err);
                res.status(500).json({ success, error: "Internal Server Error" });
            }
        }
    }

    //will do if Validation Result is not Empty,

    else {
        res.status(400).json({ success, errors: result.array() });
    }
});


//Authenticate a user using Post
router.post('/login', [
    body('email', 'Enter a valied email...').isEmail(),
    body('password', 'Password can not be blank').exists()
], async (req, res) => {
    console.log(req.body);
    let success=false;
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success,error: "Try to login with correct cradentials.." });
            }
            const psd_comp = await bcrypt.compare(password, user.password);
            if (!psd_comp) {
                return res.status(400).json({ success, error: "Try to login with correct cradentials.." });
            }
            const pay_load =
            {
                user:
                {
                    id: user.id
                }
            }
            const auth_Token = jwt.sign(pay_load, JWT_SECRET);
            success=true
            res.json({ success,  auth_Token });

        } catch (err) {
            console.log(err);
            res.status(500).json({ success ,error: "Internal Server Error" });
        }
    }
    else {
        res.status(400).json({ success, errors: result.array() });
    }
})

//Get user details using POST login required.
router.post('/getUser', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select('-password');
        res.send(user);

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Please authenticate with correct credentials." });
    }
});
router.post('/hello', async (req, res) => {
    res.json({msg:"Hellllooooo"});
});
module.exports = router;

