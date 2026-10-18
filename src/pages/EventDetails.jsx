import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultImage from "../images/default-url.jpg";

import API, {
  fetchEventById,
  bookEvent,
  checkBooking,
  cancelBooking,
  getAvailableSeats,
  fetchReviews,
  deleteEvent,
} from "../api/eventAPI";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState(null);
  const [canBook, setCanBook] = useState(true);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
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
        const seatRes = await getAvailableSeats(res.data.id);
        setSeatsLeft(seatRes.data.seatsLeft);
        setCanBook(seatRes.data.isPossibleToBook);
        if (user) {
          const bookingStatus = await checkBooking(user.id, res.data.id);
          setIsBooked(bookingStatus.data.isBooked);
        }
        if (new Date() > new Date(`${res.data.date}`)) {
          const reviewRes = await fetchReviews(res.data.id);

          setReviews(reviewRes.data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, isBooked]);

  const handleBook = async () => {
    if (numberOfPeople > seatsLeft) {
      alert(`Only ${seatsLeft} seats left!`);
      return;
    }

    try {
      await bookEvent(event.id, numberOfPeople);
      alert("Booking successful!");
      setIsBooked(true);
    } catch (err) {
      alert("You must be logged in to book.");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(user.id, event.id);
      alert("Booking cancelled.");
      setIsBooked(false);
    } catch (err) {
      alert("Could not cancel booking.");
    }
  };

  const handleEdit = () => {
    navigate(`/admin/edit-event/${event.id}`);
  };
  const handleSubmitReview = async () => {
    try {
      await API.post("/reviews/publishreview", {
        event_id: event.id,
        rating,
        comment: reviewText,
      });
      alert("Thank you for your review!");
      setReviewText("");
      setRating(5);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(event.id);
        alert("Event deleted successfully");
        navigate("/events");
      } catch (err) {
        alert("Error deleting event");
        console.error(err);
      }
    }
  };

  if (loading || !event) return <Loader />;

  return (
    <>
      <div className="p-6 max-w-3xl w-full mx-auto my-8 bg-white shadow-lg md:rounded-2xl">
        <div className="overflow-hidden rounded-2xl shadow-xl mb-6">
          <img
            src={event.banner_image_url || defaultImage}
            alt={event.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.category && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {event.category}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-2">
          📅 {new Date(event.date).toLocaleDateString()}{" "}
          {event.start_time && `⏰ ${event.start_time.slice(0, 5)}`}{" "}
          {event.end_time && ` - ${event.end_time.slice(0, 5)}`}
        </p>

        <p className="mb-2">
          📍 {event.is_online ? "Online Event" : event.location}
        </p>

        {event.is_online && event.meeting_link && (
          <p className="mb-2">
            🔗{" "}
            <a
              href={event.meeting_link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              Join Meeting
            </a>
          </p>
        )}

        {event.organizer_name && (
          <p className="mb-2">
            🎤 Hosted by:{" "}
            <span className="font-semibold">{event.organizer_name}</span>
          </p>
        )}
        {event.organizer_email && (
          <p className="mb-2">
            📧{" "}
            <a
              href={`mailto:${event.organizer_email}`}
              className="text-blue-600"
            >
              {event.organizer_email}
            </a>
          </p>
        )}

        <div className="mt-4">
          <p className="text-gray-700">{event.description}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <p>👥 Capacity: {event.capacity || "Not specified"}</p>
          <p>💰 {event.price === 0 ? "Free" : `₹${event.price}`}</p>
        </div>

        {event.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 text-lg font-medium">
          {seatsLeft > 0 ? (
            <p>🎫 Seats Left: {seatsLeft}</p>
          ) : (
            <p className="text-red-600 font-semibold">
              ❌ Event is fully booked!
            </p>
          )}
        </div>
        {!isAdmin && !isBooked && canBook && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <label htmlFor="people" className="font-medium">
              👥 Number of People
            </label>
            <input
              id="people"
              type="number"
              min="1"
              max={seatsLeft}
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {numberOfPeople > seatsLeft && (
              <p className="text-red-500 text-sm">
                Only {seatsLeft} seats are available.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 text-center space-y-4">
          {eventEnded() ? (
            <p className="text-gray-600 italic text-lg font-semibold">
              📅 This event has already happened.
            </p>
          ) : isBooked ? (
            <button
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Cancel Booking
            </button>
          ) : user.role !== "admin" && canBook ? (
            <button
              onClick={handleBook}
              disabled={numberOfPeople < 1 || numberOfPeople > seatsLeft}
              className={`${
                numberOfPeople < 1 || numberOfPeople > seatsLeft
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg font-semibold`}
            >
              Book Now
            </button>
          ) : seatsLeft === 0 ? (
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed"
            >
              Event Full
            </button>
          ) : null}
        </div>

        {isAdmin && event.created_by === user.id && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold"
            >
              ✏️ Edit Event
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold"
            >
              🗑️ Delete Event
            </button>
          </div>
        )}

        {eventEnded() && isBooked && (
          <div className="mt-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
            <textarea
              className="w-full border rounded p-2"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex items-center space-x-2 mt-2">
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmitReview}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
          </div>
        )}
        {eventEnded() && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">🌟 Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border rounded p-4 shadow-sm bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-1">
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
      </div>
      <Footer />
    </>
  );
};

export default EventDetails;
