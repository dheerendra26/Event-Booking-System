import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/eventAPI";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    API.get(`/events/${id}`)
      .then((res) => {
        if (res.data.created_by !== user.id) {
          alert("You are not authorized to edit this event.");
          navigate("/");
        } else {
          setFormData(res.data);
        }
      })
      .catch((err) => alert("Error loading event data: " + err));

    hasRun.current = true;
  }, [id, navigate, user.id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/events/${id}`, formData);
      alert("Event updated successfully");
      navigate("/admin/all-bookings");
    } catch {
      alert("Error updating event");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Edit Event</h2>
      {[
        "title",
        "description",
        "date",
        "location",
        "capacity",
        "banner_image_url",
        "thumbnail_url",
        "start_time",
        "end_time",
        "category",
        "organizer_name",
        "organizer_email",
        "venue_details",
        "meeting_link",
        "tags",
      ].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}
      <label className="block">
        Is Online:
        <input
          type="checkbox"
          name="is_online"
          checked={!!formData.is_online}
          onChange={handleChange}
        />
      </label>
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        name="status"
        value={formData.status || "upcoming"}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  );
};

export default EditEvent;
