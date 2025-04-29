import { useState } from "react";

export default function Signup() {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});

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
        setMessage("User registered! Fetching form...");
        await fetchForm();
      } else {
        setMessage("Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Registration failed.");
    }
  };

  const fetchForm = async () => {
    try {
      const res = await fetch(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
      );
      if (res.ok) {
        const data = await res.json();
        setFormData(data.form);
        console.log("Fetched Form:", data.form);
      } else {
        console.error("Failed to fetch form");
      }
    } catch (error) {
      console.error("Fetch form error:", error);
    }
  };

  const handleChange = (fieldId, value) => {
    setUserInputs({
      ...userInputs,
      [fieldId]: value,
    });
  };

  const validateSection = () => {
    const currentSection = formData.sections[currentSectionIndex];
    let valid = true;

    currentSection.fields.forEach((field) => {
      const value = userInputs[field.fieldId] || "";
      if (field.required && !value.trim()) {
        valid = false;
      }
      if (field.minLength && value.length < field.minLength) {
        valid = false;
      }
      if (field.maxLength && value.length > field.maxLength) {
        valid = false;
      }
    });

    return valid;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      alert(
        "Please complete all required fields correctly before moving to the next section."
      );
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => prev - 1);
  };

  const handleSubmitForm = () => {
    if (validateSection()) {
      console.log("Form submitted:", userInputs);
      alert("Form Submitted Successfully!");
    } else {
      alert("Please complete all required fields correctly.");
    }
  };

  return (
    <div className="p-4">
      {!formData ? (
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
          {message && <p>{message}</p>}
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">{formData.formTitle}</h2>
          {/* Render Current Section */}
          <div className="border p-4 rounded mb-4">
            <h3 className="text-lg font-semibold">
              {formData.sections[currentSectionIndex].title}
            </h3>
            <p className="text-gray-600 mb-4">
              {formData.sections[currentSectionIndex].description}
            </p>

            {formData.sections[currentSectionIndex].fields.map((field) => (
              <div key={field.fieldId} className="mb-4">
                <label className="block mb-1">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={userInputs[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={userInputs[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentSectionIndex > 0 && (
              <button
                onClick={handlePrev}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Previous
              </button>
            )}
            {currentSectionIndex < formData.sections.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitForm}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
