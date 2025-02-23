const { mongoose } = require("mongoose");

async function dbconnect() { 
  try {
    const url = process.env.MONGO_DB_URL;

    await mongoose.connect(url);
    console.log('mongo connected');
  } catch (error) {
    console.log("error in db", error);
  }
}

module.exports = dbconnect;
