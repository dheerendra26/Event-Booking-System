import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchEvents } from "../api/eventAPI";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { EVENTS_PER_PAGE } from "../utils/constants";

const initialFilters = {
  location: "",
  category: "",
  priceRange: "",
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  const setCurrentPage = useCallback(
    (pageOrUpdater) => {
      const nextPage =
        typeof pageOrUpdater === "function"
          ? pageOrUpdater(currentPage)
          : pageOrUpdater;

      setSearchParams(
        (previous) => {
          previous.set("page", String(Math.max(1, nextPage)));
          return previous;
        },
        { replace: true },
      );
    },
    [currentPage, setSearchParams],
  );

  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams(
      (previous) => {
        previous.set("page", String(currentPage));
        return previous;
      },
      { replace: true },
    );
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      setLoading(true);

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetchEvents(
          user.id,
          "user",
          currentPage,
          EVENTS_PER_PAGE,
          filters,
        );

        if (active) {
          setEvents(response.data.events);
          setTotalEvents(response.data.total);
          setError("");
        }
      } catch {
        if (active) setError("Unable to load events. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      active = false;
    };
  }, [navigate, currentPage, filters]);

  const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);

  useEffect(() => {
    if (totalEvents === 0) return;

    if (currentPage > totalPages) {
      setCurrentPage(Math.max(totalPages, 1));
    }
  }, [currentPage, totalPages, totalEvents, setCurrentPage]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const startResult =
    totalEvents === 0 ? 0 : (currentPage - 1) * EVENTS_PER_PAGE + 1;

  const endResult = Math.min(
    (currentPage - 1) * EVENTS_PER_PAGE + events.length,
    totalEvents,
  );

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="events-fade-up relative mb-8 overflow-hidden rounded-3xl bg-blue-600 px-6 py-10 text-white shadow-lg shadow-blue-600/10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-50">
              Discover experiences
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Find Your Next Event
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Explore exciting events, discover new interests, and find
              experiences worth remembering.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              {events.length} {events.length === 1 ? "event" : "events"} to
              explore
            </div>
          </div>
        </header>

        <div
          className="events-fade-up mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          style={{ "--events-delay": "100ms" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setShowFilters((previous) => !previous)}
              aria-expanded={showFilters}
              aria-controls="event-filters"
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 21v-7" />
                  <path d="M4 10V3" />
                  <path d="M12 21v-9" />
                  <path d="M12 8V3" />
                  <path d="M20 21v-5" />
                  <path d="M20 12V3" />
                  <path d="M2 14h4" />
                  <path d="M10 8h4" />
                  <path d="M18 16h4" />
                </svg>
              </span>

              <span>
                <span className="block text-base font-bold text-gray-900">
                  Find your perfect event
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Filter by location, category, or price.
                </span>
              </span>

              {hasActiveFilters && (
                <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Active
                </span>
              )}
            </button>

            <div className="flex shrink-0 items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
                aria-label={showFilters ? "Close filters" : "Open filters"}
                aria-expanded={showFilters}
                aria-controls="event-filters"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            id="event-filters"
            hidden={!showFilters}
            className="border-t border-gray-100 p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </span>
                <input
                  type="text"
                  placeholder="Search location"
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </span>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">All categories</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Tech">Tech</option>
                  <option value="Health">Health</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Ticket price
                </span>
                <select
                  value={filters.priceRange}
                  onChange={(e) => updateFilter("priceRange", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">All prices</option>
                  <option value="free">Free</option>
                  <option value="low">₹1 – ₹500</option>
                  <option value="high">Above ₹500</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <section aria-label="Available events">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Explore Events
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {startResult}–{endResult} of {totalEvents} results
              </p>
            </div>

            {hasActiveFilters && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Filters applied
              </span>
            )}
          </div>

          {error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 text-center">
              <p className="font-semibold text-gray-900">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                ⌕
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                No events found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {hasActiveFilters
                  ? "No events match your selected filters. Try changing them."
                  : "There are no events available right now. Please check back later."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                key={currentPage}
                className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => navigate(`/event/${event.id}`)}
                    aria-label={`View details for ${event.title || event.name || "event"}`}
                    className="events-card group min-w-0 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                    style={{
                      "--events-delay": `${index * 70}ms`,
                    }}
                  >
                    <div className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                      <EventCard event={event} />
                    </div>
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Event pagination"
                  className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row"
                >
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={isCurrentPage ? "page" : undefined}
                          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-all duration-200 ${
                            isCurrentPage
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
