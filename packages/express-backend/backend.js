// file.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// /users GET route with optional query parameters 'name' and 'job'
app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    res.status(500).send(error);
  }
});

// /users/:id GET route to retrieve a user by id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userServices.findUserById(id);
    if (result === null) {
      res.status(404).send("User not found.");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// /users POST route to add a new user
app.post("/users", async (req, res) => {
  const userToAdd = req.body;

  try {
    const result = await userServices.addUser(userToAdd);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// /users/:id DELETE route to delete a user by id
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userServices.deleteUserById(id);
    if (result === null) {
      res.status(404).send("User not found");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

