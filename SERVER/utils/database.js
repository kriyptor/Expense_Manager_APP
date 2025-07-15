const mongoose = require(`mongoose`);

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(`You've got an error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectToDB };