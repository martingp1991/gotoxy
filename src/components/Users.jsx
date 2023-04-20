import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    axios
      .get("https://gorest.co.in/public-api/users")
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`https://gorest.co.in/public-api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        })
        .then((response) => {
          if (response.status === 204 || response.data.data === null) {
            setUsers(users.filter((user) => user.id !== userId));
          } else {
            throw new Error("Failed to delete user.");
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to delete user.");
        });
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditing(true);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  const handleUserFormSubmit = (event) => {
    event.preventDefault();

    const { name, email, gender, status } = event.target.elements;

    axios
      .put(
        `https://gorest.co.in/public-api/users/${currentUser.id}`,
        {
          name: name.value,
          email: email.value,
          gender: gender.value,
          status: status.value,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      )
      .then((response) => {
        const updatedUser = response.data.data;
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setEditing(false);
        setCurrentUser(null);
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to update user.");
      });
  };

  const handleCreateUser = () => {
    setCreating(true);
  };

  const handleUserCreation = (event) => {
    event.preventDefault();

    const { name, email, gender, status } = event.target.elements;

    axios
      .post(
        "https://gorest.co.in/public-api/users",
        {
          name: name.value,
          email: email.value,
          gender: gender.value,
          status: status.value,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      )
      .then((response) => {
        const newUser = response.data.data;
        setUsers([...users, newUser]);
        setCreating(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to create user.");
      });
  };

  const filteredUsers = users.filter((user) => {
    if (genderFilter !== "all" && user.gender !== genderFilter) {
      return false;
    }

    if (
      nameFilter !== "" &&
      !user.name.toLowerCase().includes(nameFilter.toLowerCase())
    ) {
      return false;
    }

    return true;
  });


  return (
    <div className="container mx-auto mt-10">
      {editing && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUserFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={currentUser.name}
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={currentUser.email}
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block font-bold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  defaultValue={currentUser.gender}
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  defaultValue={currentUser.status}
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {creating && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg border border-gray-400">
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            <form onSubmit={handleUserCreation}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block font-bold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-full rounded-lg border border-gray-400 p-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => setCreating(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between mb-4 ">
        <div>
          <label htmlFor="genderFilter">Gender:</label>
          <select
            className="w-full rounded-lg border border-gray-400 p-2"
            id="genderFilter"
            value={genderFilter}
            onChange={handleGenderFilterChange}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="nameFilter">Search</label>
          <input
            className="w-full rounded-lg border border-gray-400 p-2"
            type="text"
            id="nameFilter"
            value={nameFilter}
            onChange={handleNameFilterChange}
            placeholder="User name..."
          />
        </div>
      </div>
      <div className="mb-4 text-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-10"
          onClick={handleCreateUser}
        >
          Create User
        </button>
      </div>
      <table className="table-auto w-full border-separate">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.gender}</td>
              <td className="border px-4 py-2">{user.status}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
