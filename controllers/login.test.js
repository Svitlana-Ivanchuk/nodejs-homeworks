require("dotenv").config();

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { User } = require("../models/user");

const DB_TEST_URI = process.env.DB_TEST_URI;

mongoose.set("strictQuery", true);
let user;

beforeAll(async () => {
 await mongoose.connect(DB_TEST_URI);
 await User.deleteMany();

 const user = new User({ email: "olga@gmail.com", password: "123456" });
 await user.save();

 //console.log(user);
 //userId = user._id;
});

describe("login", () => {
 //let userId;

 test("should return response status code 200", async () => {
  const res = await supertest(app).post("/users/login").send({
   email: "olga@gmail.com",
   password: "123456",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.data.user.email).toBe("olga@gmail.com");
 });

 test("should return response token", async () => {
  const res = await supertest(app).post("/users/login").send({
   email: "olga@gmail.com",
   password: "123456",
  });

  //const user = await User.findById(userId);

  expect(res.body.token).toBeDefined();
 });

 test("should return response status code 401 for unsuccessful login", async () => {
  const res = await supertest(app)
   .post("/users/login")
   .send({ email: "olga@gmail.com", password: "incorrectPassword" });

  expect(res.statusCode).toBe(401);
 });
});
afterAll(async () => {
 await mongoose.connection.close();
});
