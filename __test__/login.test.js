require("dotenv").config();

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { User } = require("../models/user");

const DB_TEST_URI = process.env.DB_TEST_URI;

mongoose.set("strictQuery", true);

describe("login", () => {
 let userId;

 beforeAll(async () => {
  await mongoose.connect(DB_TEST_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  });
  await User.deleteMany();

  const user = new User({ email: "olga@gmail.com", password: "123456" });
  await user.save();
  userId = user._id;
 });

 test("should return response status code 200", async () => {
  const res = await supertest(app)
   .post("/users/login")
   .send({ email: "olga@gmail.com", password: "123456" });

  expect(res.statusCode).toBe(200);
 });

 //test("should return response token", async () => {
 // const res = await supertest(app).post("/users/login").send({
 //  email: "olga@gmail.com",
 //  password: "123456",
 // });

 // const user = await User.findById(userId);

 // expect(res.body.token).toBeDefined();
 //});

 //afterAll(async () => {
 // await mongoose.connection.close();
 //});
});
