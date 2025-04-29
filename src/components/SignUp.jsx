import { useState } from "react";
import DynamicForm from "./DynamicForm";

export default function Signup() {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://dynamic-form-generator-9rl7.onrender.com/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rollNumber, name }),
        }
      );

      if (response.ok) {
        setRegistered(true);
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  if (registered) {
    return <DynamicForm rollNumber={rollNumber} />;
  }

  return (
    <div className="p-4 center">
      <div className="text-">Login Page</div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label>Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
