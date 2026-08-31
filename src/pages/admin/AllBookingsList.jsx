import React, { useEffect, useState } from "react";
import { fetchAllBookings } from "../../api/eventAPI";
import Loader from "../../components/Loader";

const AllBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetchAllBookings(user.id, user.role).then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);
    const title = b.event_title.toLowerCase();
    const location = b.event_location?.toLowerCase() || "";

    const matchesKeywords = keywords.length
      ? keywords.some((word) => title.includes(word))
      : true;

    const matchesLocation = locationFilter
      ? location.includes(locationFilter.toLowerCase())
      : true;

    const eventDateOnly = new Date(b.date).toISOString().split("T")[0];
    const matchesDate = filterDate ? eventDateOnly === filterDate : true;

    return matchesKeywords && matchesLocation && matchesDate;
  });

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">📋 All Bookings</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="📍 Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      <ul className="space-y-3">
        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-32">
            No matching bookings found.
          </p>
        ) : (
          filteredBookings.map((b) => (
            <li
              key={b.booking_id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
            >
              <p>
                <strong>User:</strong> {b.user_name}
              </p>
              <p>
                <strong>Event:</strong> {b.event_title}
              </p>
              <p>
                <strong>Location:</strong> {b.event_location}
              </p>
              <p>
                <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllBookingsList;
