import React, { useState } from "react";

export default function AddTeam() {
  const [team, setTeam] = useState({
    name: "",
    manager: "",
    logo: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setTeam({ ...team, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Team created successfully!");
        setTeam({ name: "", manager: "", logo: "" });
      } else {
        setMessage(`Error: ${data.error || "Failed to create team"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error — check server connection.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add a New Team</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80 flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Team Name"
          value={team.name}
          onChange={handleChange}
          required
          className="border p-2 rounded-lg"
        />


        <input
          type="text"
          name="manager"
          placeholder="Manager Name"
          value={team.manager}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <input
          type="text"
          name="logo"
          placeholder="Logo URL"
          value={team.logo}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <button
          type="submit"
          className="bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
        >
          Add Team
        </button>
      </form>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
