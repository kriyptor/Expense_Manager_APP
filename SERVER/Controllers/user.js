const { User } = require("../Models/users");
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);


function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const generateAccessToken = (id, name, premiumUser) => {
    return jwt.sign({ userId: id, name, premiumUser }, process.env.JWT_SECRET_KEY);
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate inputs
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: `User already exists!`
            });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Successfully created new user'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate inputs
        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        console.log(`This is from login-cont:`, user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User does not exist!`
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: `Invalid credentials!`
            });
        }

        const token = generateAccessToken(user.id, user.name, user.premiumUser);
        
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.checkPremiumUser = async (req, res) => {
    try {
       
        const userId = req.user._id; 
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID not found in request'
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: `User not found!`
            });
        }
        
        return res.status(200).json({
            success: true,
            userIsPremium: userData.premiumUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}