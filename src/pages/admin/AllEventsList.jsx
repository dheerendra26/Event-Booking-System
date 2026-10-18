import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/eventAPI";

const AllEventsList = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id || !user?.role) {
          throw new Error("User information not found. Please log in again.");
        }

        const res = await fetchEvents(user.id, user.role, 1, 50, {
          location: locationFilter,
          category: categoryFilter,
          priceRange,
          search: searchQuery,
          date: filterDate,
        });

        const data = res.data;
        const eventList = Array.isArray(data)
          ? data
          : Array.isArray(data?.events)
            ? data.events
            : [];

        setEvents(eventList);
        setTotal(
          typeof data?.total === "number" ? data.total : eventList.length,
        );
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err.message || "Failed to fetch events.");
        setEvents([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationFilter, categoryFilter, priceRange, searchQuery, filterDate]);

  const filteredEvents = events.filter((event) => {
    const title = String(event.title || "").toLowerCase();
    const keywords = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const matchesSearch = keywords.every((word) => title.includes(word));

    const eventDate = event.date ? String(event.date).slice(0, 10) : "";

    const matchesDate = !filterDate || eventDate === filterDate;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Events</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        >
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="low">₹1 - ₹500</option>
          <option value="high">Above ₹500</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setLocationFilter("");
            setCategoryFilter("");
            setPriceRange("");
            setFilterDate("");
          }}
          className="border px-4 py-2 rounded w-full hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-12">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-12">{error}</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No matching events found.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredEvents.length} of {total} events
          </p>

          <ul className="space-y-3">
            {filteredEvents.map((event) => (
              <li
                key={event.id}
                onClick={() => navigate(`/admin/eventsummary/${event.id}`)}
                className="cursor-pointer p-4 border rounded-lg shadow hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>

                <p className="text-sm text-gray-600">
                  {event.date
                    ? new Date(
                        `${String(event.date).slice(0, 10)}T00:00:00`,
                      ).toLocaleDateString()
                    : "Date unavailable"}{" "}
                  | {event.location || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  Category: {event.category || "N/A"} | Price:{" "}
                  {Number(event.price) === 0
                    ? "Free"
                    : `₹${event.price ?? "N/A"}`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AllEventsList;
