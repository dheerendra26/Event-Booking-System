import React, { useState } from "react";
import API from "../../api/eventAPI";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    venue_details: "",
    capacity: "",
    is_online: false,
    meeting_link: "",
    banner_image_url: "",
    thumbnail_url: "",
    organizer_name: "",
    organizer_email: "",
    category: "",
    price: 0,
    tags: "",
    status: "upcoming",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "title",
      "description",
      "date",
      "location",
      "venue_details",
      "capacity",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.trim()
    );
    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields:\n- ${missingFields.join(
          "\n- "
        )}`
      );
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You are not logged in.");
      return;
    }

    const dataToSend = {
      ...formData,
      created_by: user.id,
    };

    try {
      await API.post("/events", dataToSend);
      alert("Event created successfully");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  const Label = ({ name, required }) => (
    <label className="block text-sm font-semibold mb-1">
      {name} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 bg-white rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

        <div>
          <Label name="Title" required />
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <Label name="Description" required />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-y"
          />
        </div>

        <div>
          <Label name="Location" required />
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <Label name="Venue Details" required />
          <input
            name="venue_details"
            type="text"
            value={formData.venue_details}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {[
          "Organizer_Name",
          "Organizer_Email",
          "Category",
          "Tags",
          "Banner_Image_Url",
          "Thumbnail_Url",
          "Meeting_Link",
        ].map((field) => (
          <div key={field}>
            <Label name={field.replaceAll("_", " ")} />
            <input
              name={field}
              type="text"
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <Label name="Date" required />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="w-full">
            <Label name="Start Time" />
            <input
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="w-full">
            <Label name="End Time" />
            <input
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <Label name="Capacity" required />
            <input
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="w-full">
            <Label name="Price" />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            name="is_online"
            type="checkbox"
            checked={formData.is_online}
            onChange={handleChange}
          />
          <label htmlFor="is_online" className="text-sm">
            Is this an online event?
          </label>
        </div>

        <div>
          <Label name="Status" />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
