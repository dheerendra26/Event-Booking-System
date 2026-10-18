import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/eventAPI";
import { DEBOUNCE_DELAY, EVENTS_PER_PAGE } from "../../utils/constants";

const initialFilters = {
  search: "",
  location: "",
  category: "",
  priceRange: "",
  date: "",
};

const AllEventsList = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { search, location, category, priceRange, date } = filters;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setDebouncedLocation(location.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [search, location]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, category, priceRange, date]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id || !user?.role) {
          throw new Error("User information not found. Please log in again.");
        }

        const res = await fetchEvents(
          user.id,
          user.role,
          currentPage,
          EVENTS_PER_PAGE,
          {
            location: debouncedLocation,
            category,
            priceRange,
            search: debouncedSearch,
            date,
          },
        );

        const data = res.data;
        const eventList = Array.isArray(data)
          ? data
          : Array.isArray(data?.events)
            ? data.events
            : [];

        if (active) {
          setEvents(eventList);
          setTotal(
            typeof data?.total === "number" ? data.total : eventList.length,
          );
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch events:", err);
          setError(err.message || "Failed to fetch events.");
          setEvents([]);
          setTotal(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [
    currentPage,
    debouncedSearch,
    debouncedLocation,
    category,
    priceRange,
    date,
  ]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setDebouncedSearch("");
    setDebouncedLocation("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / EVENTS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">All Events</h2>

        <button
          type="button"
          onClick={() => setShowFilters((previous) => !previous)}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <select
            value={category}
            onChange={(e) => updateFilter("category", e.target.value)}
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
            onChange={(e) => updateFilter("priceRange", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="low">₹1 - ₹500</option>
            <option value="high">Above ₹500</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => updateFilter("date", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <button
            type="button"
            onClick={clearFilters}
            className="border px-4 py-2 rounded w-full hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-12">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-12">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No matching events found.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {events.length} of {total} events
          </p>

          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                onClick={() => navigate(`/admin/event-summary/${event.id}`)}
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

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className="border px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage >= totalPages}
                className="border px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllEventsList;
