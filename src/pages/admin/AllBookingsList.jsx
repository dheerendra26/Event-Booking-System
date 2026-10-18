import React, { useEffect, useState } from "react";
import { fetchAllBookings } from "../../api/eventAPI";
import Loader from "../../components/Loader";
import { BOOKINGS_PER_PAGE, DEBOUNCE_DELAY } from "../../utils/constants";

const AllBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setDebouncedLocation(locationFilter.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, locationFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedLocation, filterDate]);

  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setError("Please log in to view bookings.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetchAllBookings(
          user.id,
          user.role,
          page,
          BOOKINGS_PER_PAGE,
          {
            search: debouncedSearch,
            location: debouncedLocation,
            date: filterDate,
          },
        );

        if (cancelled) return;

        const data = res.data;
        setBookings(Array.isArray(data) ? data : data.bookings || []);
        setTotal(data.total ?? 0);
        setTotalPages(
          data.totalPages ?? Math.ceil((data.total ?? 0) / BOOKINGS_PER_PAGE),
        );
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setBookings([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, debouncedLocation, filterDate]);

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setFilterDate("");
    setDebouncedSearch("");
    setDebouncedLocation("");
    setPage(1);
  };

  if (loading && bookings.length === 0) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">All Bookings</h1>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          aria-expanded={showFilters}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-3 px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No matching bookings found.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {bookings.length} bookings on this page, out of {total}{" "}
            total bookings.
          </p>

          <ul className="space-y-3">
            {bookings.map((b) => (
              <li
                key={b.booking_id}
                className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition"
              >
                <p>
                  <strong>User:</strong> {b.user_name}
                </p>
                <p>
                  <strong>Event:</strong> {b.event_title}
                </p>
                <p>
                  <strong>Location:</strong> {b.event_location || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {b.date
                    ? new Date(
                        `${String(b.date).slice(0, 10)}T00:00:00`,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      {!error && totalPages > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBookingsList;
