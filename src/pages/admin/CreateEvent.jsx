import React, { useEffect, useState } from "react";
import API from "../../api/eventAPI";
import { useNavigate } from "react-router-dom";

const DRAFT_KEY = "create_event_draft";

const initialFormData = {
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
};

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);

      return savedDraft
        ? { ...initialFormData, ...JSON.parse(savedDraft) }
        : initialFormData;
    } catch (error) {
      console.error("Failed to load event draft:", error);
      return initialFormData;
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save event draft:", error);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const Label = ({ children, required = false }) => (
    <label className="block text-sm font-semibold mb-1">
      {children}{" "}
      {required ? (
        <span className="text-red-500">*</span>
      ) : (
        <span className="text-gray-400 font-normal">(optional)</span>
      )}
    </label>
  );

  const validateStep = () => {
    let requiredFields = [];

    if (currentStep === 1) {
      requiredFields = ["title", "description"];
    }

    if (currentStep === 2) {
      requiredFields = ["date", "location", "venue_details", "capacity"];
    }

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];

      return !value || String(value).trim() === "";
    });

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((field) =>
        field
          .replaceAll("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      );

      alert(
        `Please fill in the following required fields:\n- ${fieldNames.join(
          "\n- ",
        )}`,
      );

      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

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
      setIsSubmitting(true);

      await API.post("/events", dataToSend);

      localStorage.removeItem(DRAFT_KEY);

      alert("Event created successfully");

      setTimeout(() => {
        navigate("/events");
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Error creating event");
      setIsSubmitting(false);
    }
  };

  const clearDraft = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all entered event data?",
    );

    if (!confirmed) return;

    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
    },
    {
      number: 2,
      title: "Date & Location",
    },
    {
      number: 3,
      title: "Organizer & Pricing",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Create New Event</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete the steps below to create your event.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/events")}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Go to Events
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>

                  <span
                    className={`text-xs mt-2 text-center hidden sm:block ${
                      currentStep >= step.number
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 sm:mx-4 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 bg-white rounded-xl shadow"
        >
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold">Basic Information</h3>

                <p className="text-sm text-gray-500">
                  Tell people what your event is about.
                </p>
              </div>

              <div>
                <Label required>Title</Label>

                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <Label required>Description</Label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-y"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <Label>Category</Label>

                <input
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Technology, Music, Sports"
                />
              </div>

              <div>
                <Label>Tags</Label>

                <input
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. tech, startup, networking"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold">Date & Location</h3>

                <p className="text-sm text-gray-500">
                  When and where will your event happen?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label required>Date</Label>

                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <Label>Start Time</Label>

                  <input
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <Label>End Time</Label>

                  <input
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label required>Location</Label>

                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>

              <div>
                <Label required>Venue Details</Label>

                <input
                  name="venue_details"
                  type="text"
                  value={formData.venue_details}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Convention Center, Hall A"
                />
              </div>

              <div>
                <Label required>Capacity</Label>

                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Maximum attendees"
                />
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input
                    id="is_online"
                    name="is_online"
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={handleChange}
                  />

                  <label htmlFor="is_online" className="text-sm font-medium">
                    Is this an online event?
                  </label>
                </div>

                {formData.is_online && (
                  <div className="mt-4">
                    <Label>Meeting Link</Label>

                    <input
                      name="meeting_link"
                      type="url"
                      value={formData.meeting_link}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold">Organizer & Pricing</h3>

                <p className="text-sm text-gray-500">
                  Add the remaining details before creating your event.
                </p>
              </div>

              <div>
                <Label>Organizer Name</Label>

                <input
                  name="organizer_name"
                  type="text"
                  value={formData.organizer_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Organizer name"
                />
              </div>

              <div>
                <Label>Organizer Email</Label>

                <input
                  name="organizer_email"
                  type="email"
                  value={formData.organizer_email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="organizer@example.com"
                />
              </div>

              <div>
                <Label>Price</Label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Enter 0 for a free event.
                </p>
              </div>

              <div>
                <Label>Banner Image URL</Label>

                <input
                  name="banner_image_url"
                  type="url"
                  value={formData.banner_image_url}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Thumbnail URL</Label>

                <input
                  name="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Status</Label>

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
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t">
            <div>
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={clearDraft}
                  className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Clear Draft
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>

            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="text-xs text-gray-400 text-center mt-3">
          Your progress is automatically saved on this device.
        </p>
      </div>
    </div>
  );
};

export default CreateEvent;
