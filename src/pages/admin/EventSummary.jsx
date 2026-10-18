import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { deleteEvent, fetchEventById, fetchReviews } from "../../api/eventAPI";
import Loader from "../../components/Loader";

const EventSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const alertShownRef = useRef(false);

  const eventEnded = () => {
    if (!event?.date) return false;
    const endDateTime = new Date(`${event.date}`);
    return new Date() > endDateTime;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchEventById(id);
        setEvent(res.data);

        const bookingsRes = await API.get(`/events/${id}/attendees-count`);
        setAttendeesCount(bookingsRes.data.totalAttendees);

        if (new Date() > new Date(`${res.data.date}`)) {
          const reviewRes = await fetchReviews(id);
          setReviews(reviewRes.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading event summary:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading && event && user?.id !== event.created_by) {
      alertShownRef.current = true;
      alert("You cannot view this page");
      navigate("/");
    }
  }, [event, loading, user, navigate]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEvent(event.id)
      alert("Event deleted successfully");
      navigate("/admin/all-events");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  if (loading || !event || user?.id !== event.created_by) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">📊 Event Summary (Admin)</h1>

      <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-2">
        📅 {new Date(event.date).toLocaleDateString()}{" "}
        {event.start_time &&
          `⏰ ${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}`}
      </p>
      <p className="mb-2">
        📍 {event.is_online ? "Online Event" : event.location}
      </p>
      {event.organizer_name && <p>🎤 Organizer: {event.organizer_name}</p>}
      <p>👥 Capacity: {event.capacity}</p>
      <p>💰 Price: {event.price === 0 ? "Free" : `₹${event.price}`}</p>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">✅ Attendance</h3>
        <p>
          <span className="font-bold">{attendeesCount}</span> people attended
          this event.
        </p>
      </div>

      {eventEnded() && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">🌟 Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews available yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border rounded p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold">{review.user_name}</p>
                    <p className="text-yellow-600">{review.rating} ⭐</p>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6 mb-4">
        <button
          onClick={() => navigate(`/admin/edit-event/${event.id}`)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ✏️ Edit Event
        </button>

        <button
          onClick={handleDelete}
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          🗑️ Delete Event
        </button>
      </div>
    </div>
  );
};

export default EventSummary;
