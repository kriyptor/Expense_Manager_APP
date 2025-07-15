const jwt = require(`jsonwebtoken`);
const { User } = require(`../Models/users`);


exports.authenticate = async (req, res, next) =>{
    try {
        const token = req.header(`Authorization`);

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
          }
        
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        

        const validUser = await User.findById(decodedUser.userId) 

        if (!validUser) {
          return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = validUser;

        next()

    } catch (error) {
        console.log("Authentication error:", error);
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
    }
}