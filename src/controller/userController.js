const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValid, isValidRequestBody, isValidObjectId } = require('../utils/validator');
const saltRounds = 10;
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

// user registration 
const userRegistration = async (req, res) => {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User details" })
        }

        //Destructuring the request body
        const { title, fullname, email, password } = requestBody;

        // Basic user validations
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is required" });
        }

        if (["Mr", "Mrs", "Miss"].indexOf(title) === -1) {
            return res.status(400).send({ status: false, msg: "Please  enter a vaild Title" })
        }
        if (!isValid(fullname)) {
            return res.status(400).send({ status: false, message: "fullname is required" });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }

        //email valid syntax validation
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Email should be a valid email" });
        }
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return res.status(400).send({ status: false, message: "Email already registered" });
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        // Password validation like upperCase, lowerCase , minLength, maxLength, Special character
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password))) {
            return res.status(400).send({ status: false, message: 'password should be valid password' })
        }

        //hashing password using bcrypt
        const hashPassword = bcrypt.hashSync(password, saltRounds);

        //create a object 
        const userData = {
            title: title, fullname: fullname, email: email, password: hashPassword
        }
        const userCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'User created successfully', data: userCreated })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//User login
const userLogin = async (req, res) => {
    try {
        // Basic user validation
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User details" })
        }
        const { email, password } = requestBody;
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Email should be a valid email" });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' });
        }

        // fetching user data using email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ status: false, message: "User doesn't exists. Please register first" })
        }

        // comparing password of DB and getting from user
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).send({ status: false, message: "Password not matched" });
        }

        // Creating jwt token and save it on cookie
        const token = jwt.sign({
            userId: user._id
        }, 'abc123', { expiresIn: '1h' });
        res.cookie(`jwt`, token);

        return res.status(200).send({ status: true, message: "Success" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//User logout using deleting cookies
const userLogout = async (req, res) => {
    try {
        // Delete the token saved in cookie
        res.clearCookie('jwt')
        return res.status(200).send({ status: true, message: 'User logout successfully' });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
        const requestBody = req.body;
        const { currentPassword, newPassword } = requestBody;

        // Basic user validation
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User details" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Only Object Id allowed !' });
        }
        if (!isValid(currentPassword)) {
            return res.status(400).send({ status: false, message: 'currentPassword is required' })
        }
        if (!isValid(newPassword)) {
            return res.status(400).send({ status: false, message: 'newPassword is required' })
        }

        const user = await userModel.findById({ _id: userId });

        // comparing password of DB and getting from user
        const isMatched = await bcrypt.compare(currentPassword, user.password);
        if (!isMatched) {
            return res.status(400).send({ status: false, message: "Password not matched" });
        }

        // Password validation like upperCase, lowerCase , minLength, maxLength, Special character
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(newPassword))) {
            return res.status(400).send({ status: false, message: 'newPassword should be valid password' })
        }

        //hashing password using bcrypt
        const hashPassword = bcrypt.hashSync(newPassword, saltRounds);

        const passwordUpdate = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { password: hashPassword } });
        return res.status(200).send({ status: true, message: "Password change successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { userRegistration, userLogin, userLogout, changePassword };