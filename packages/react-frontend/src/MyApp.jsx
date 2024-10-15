import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // Function to fetch users from the backend
  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  // useEffect hook to fetch users when the component first mounts
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json()) // Parse the JSON from the response
      .then((json) => {
        // Set the users in the component's state
        setCharacters(json["users_list"]);
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Log any errors
      });
  }, []); // Empty array ensures this only runs once when the component mounts

  function removeOneCharacter(index) {
    const userId = characters[index]._id; // Get the ID of the user to delete
  
    // Make the DELETE request to the backend
    fetch(`http://localhost:8000/users/${userId}`, { method: 'DELETE' })
      .then((res) => {
        if (res.status === 204) {
          // If deletion was successful, remove from local state
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  }

  // Function to post a new user to the backend
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person), // Send the user data as a JSON string
    });

    return promise; // Return the promise so we can handle it later
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json(); // Get the newly created user from the response
        } else {
          throw new Error("Failed to create user");
        }
      })
      .then((newUser) => {
        // Update the state with the new user (which includes the generated ID)
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }

  return (
    <div className="container">
      <h1>List of Characters</h1>
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

