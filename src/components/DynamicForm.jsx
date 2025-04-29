import { useEffect, useState } from "react";

export default function DynamicForm({ rollNumber }) {
  const [formData, setFormData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const res = await fetch(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
      );
      if (res.ok) {
        const data = await res.json();
        setFormData(data.form);
      } else {
        console.error("Failed to fetch form");
      }
    } catch (error) {
      console.error("Fetch form error:", error);
    }
  };

  const handleChange = (fieldId, value) => {
    setUserInputs((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validateSection = () => {
    const currentSection = formData.sections[currentSectionIndex];
    let valid = true;

    currentSection.fields.forEach((field) => {
      const value = userInputs[field.fieldId] || "";
      if (field.required && !value.toString().trim()) {
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
      alert("Please fill all required fields correctly before moving forward.");
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => prev - 1);
  };

  const handleSubmitForm = () => {
    if (validateSection()) {
      console.log("✅ Full Form Data Submitted:");
      console.table(userInputs);
      alert("Form Submitted Successfully!");
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  if (!formData) {
    return <p>Loading form...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">{formData.formTitle}</h2>

      <div className="border p-4 rounded mb-4">
        <h3 className="text-xl font-semibold">
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
                onChange={(e) => handleChange(field.fieldId, e.target.value)}
                className="border p-2 w-full"
              />
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={userInputs[field.fieldId] || false}
                onChange={(e) => handleChange(field.fieldId, e.target.checked)}
                className="mr-2"
              />
            ) : field.type === "radio" ? (
              <div>
                {field.options?.map((option) => (
                  <label key={option.value} className="block">
                    <input
                      type="radio"
                      name={field.fieldId}
                      value={option.value}
                      checked={userInputs[field.fieldId] === option.value}
                      onChange={(e) =>
                        handleChange(field.fieldId, e.target.value)
                      }
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : field.type === "dropdown" ? (
              <select
                value={userInputs[field.fieldId] || ""}
                onChange={(e) => handleChange(field.fieldId, e.target.value)}
                className="border p-2 w-full"
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={userInputs[field.fieldId] || ""}
                onChange={(e) => handleChange(field.fieldId, e.target.value)}
                className="border p-2 w-full"
              />
            )}
          </div>
        ))}
      </div>

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
  );
}
