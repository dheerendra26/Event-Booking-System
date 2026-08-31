import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/eventAPI";

const AllEventsList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetchEvents(user.id, user.role);

        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchData();
  }, []);
  const filteredEvents = events.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const location = event.location?.toLowerCase() || "";
    const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);

    const matchesKeywords = keywords.length
      ? keywords.some((word) => title.includes(word))
      : true;

    const matchesLocation = locationFilter
      ? location.includes(locationFilter.toLowerCase())
      : true;

    const eventDate = new Date(event.date).toISOString().split("T")[0];
    const matchesDate = filterDate ? eventDate === filterDate : true;

    return matchesKeywords && matchesLocation && matchesDate;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📝 All Events</h2>

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
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500 mt-32">
            No matching events found.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <li
              key={event.id}
              onClick={() => navigate(`/admin/eventsummary/${event.id}`)}
              className="cursor-pointer p-4 border rounded-lg shadow hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
                {event.location || "N/A"}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllEventsList;
