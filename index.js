const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB_URI;
console.log(DB_URI);
async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
