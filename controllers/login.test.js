const mongoose = require("mongoose");
const supertest = require("supertest");
const {
 beforeAll,
 afterAll,
 describe,
 expect,
 test,
} = require("@jest/globals");
const app = require("../app");
const { User } = require("../models/user");
require("dotenv").config();

const { DB_TEST_URI } = process.env;
const newUser = {
 email: "olga2@gmail.com",
 password: "123456",
};

mongoose.set("strictQuery", true);

describe("register/login", () => {
 beforeAll(async () => {
  await mongoose.connect(DB_TEST_URI);
  await User.deleteMany();
 });

 test("should create new user and return status code 201", async () => {
  const response = await supertest(app).post("/users/register").send(newUser);
  expect(response.statusCode).toBe(201);
 });

 test("should return response status code 200", async () => {
  const response = await supertest(app).post("/users/login").send(newUser);
  expect(response.statusCode).toBe(200);
 });

 test("should return user object with 2 fields email and subscription with data type String", async () => {
  const response = await supertest(app).post("/users/login").send(newUser);
  expect(response.body.user.email).toBe(newUser.email);
  expect(response.body.user.subscription).toBe(
   "starter" || "pro" || "business"
  );
  expect(response.body.user).toEqual({
   email: expect.any(String),
   subscription: expect.any(String),
  });
 });

 test("should return response token", async () => {
  const response = await supertest(app).post("/users/login").send(newUser);
  expect(response.body.token).toBeTruthy();
 });

 test("should return response status code 409 if the mail is already registered", async () => {
  await supertest(app).post("/users/register").send(newUser);
  const response = await supertest(app).post("/users/register").send(newUser);
  expect(response.statusCode).toBe(409);
 });

 test("should return response status code 401 for unsuccessful login", async () => {
  const response = await supertest(app)
   .post("/users/login")
   .send({ email: "anna@gmail.com", password: "1234567" });
  expect(response.statusCode).toBe(401);
 });

 afterAll(async () => {
  await mongoose.disconnect(DB_TEST_URI);
 });
});
