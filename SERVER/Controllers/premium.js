const { Expense } = require(`../Models/expenses`);
const { User } = require(`../Models/users`)

exports.getLeaderboardData = async (req, res) => {
    try {

        const leaders = await User.find({}, { _id : 1, name : 1, totalExpense : 1 }).sort({ totalExpense : -1 })

       /* const leaders = await User.aggregate([
         {
           $project: {
             _id: 1,
             name: 1,
             totalExpense: 1,
           },
         },
         {
           $sort: { totalExpense: -1 },
         },
       ]); */

        res.status(200).json({
            success: true,
            data : leaders
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({ 
            success: false,
            error : error.message
        });
    }
}

exports.makeUserPremium = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is already premium
    if (user.premiumUser) {
      return res.status(400).json({
        success: false,
        message: "User is already premium"
      });
    }

    // Update user to premium
    const updatedUser = await User.findByIdAndUpdate(userId, { premiumUser: true }, { new: true });

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to update user to premium"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is Premium Now!"
    });

  } catch (error) {
    console.log('Premium update error:', error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}