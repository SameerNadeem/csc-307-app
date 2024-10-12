import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};
app.use(express.json());



// Helper funcs
const findUserByName = (name) => {
  return users["users_list"].filter((user) =>user["name"]=== name);
};

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"]=== name && user["job"] === job
  );
};

const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const initialLength = users["users_list"].length;
  users["users_list"] = users["users_list"].filter(user => user["id"] !== id);
  return users["users_list"].length < initialLength;
};

// Root
app.get("/", (req, res) => {
  res.send("Hello World! 307 @calpoly");
});

// /users GET route with name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    let result = findUsersByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);} else if (name !== undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {vres.send(users);}
});

// /users/:id GET route to a user via id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("User not found.");
  } else {
    res.send(result);
  }
});


// POST /users route to add a new user
app.post("/users", (req, res) => {
    const userToAdd = req.body;
  
    // unique ID for the new user
    userToAdd.id = Math.random().toString(36).substring(2, 8);
  
    // Add the user to the users list
    users["users_list"].push(userToAdd);
    res.status(201).send(userToAdd);
  });

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = users["users_list"].length;
  
    // matching id
    users["users_list"] = users["users_list"].filter(user => user.id !== id);
  
    // If no user was deleted then im returning a 404
    if (users["users_list"].length === initialLength) {
      return res.status(404).send("User not found");
    }
  
    // if not return a 204 for a successful deletion
    res.status(204).send();
  });

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

