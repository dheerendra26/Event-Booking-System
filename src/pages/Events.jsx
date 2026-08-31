import React, { useEffect, useRef, useState } from "react";
import { fetchEvents } from "../api/eventAPI";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    priceRange: "",
  });

  const filteredEvents = events.filter((event) => {
    const matchesLocation = filters.location
      ? event.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesCategory = filters.category
      ? event.category === filters.category
      : true;

    const price = parseFloat(event.price);
    const matchesPrice =
      filters.priceRange === "free"
        ? price === 0
        : filters.priceRange === "low"
        ? price > 0 && price <= 500
        : filters.priceRange === "high"
        ? price > 500
        : true;

    return matchesLocation && matchesCategory && matchesPrice;
  });

  const navigate = useNavigate();
  const hasAlerted = useRef(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      if (!hasAlerted.current) {
        alert("You must be logged in to see the events");
        hasAlerted.current = true;
        navigate("/login");
      }
      return;
    }

    fetchEvents(user.id, "user").then((res) => {
      setEvents(res.data);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow px-4">
        <div className="mt-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="📍 Filter by location..."
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) =>
              setFilters({ ...filters, priceRange: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="low">₹0 - ₹500</option>
            <option value="high">Above ₹500</option>
          </select>

          <button
            onClick={() =>
              setFilters({ location: "", category: "", priceRange: "" })
            }
            className="text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-4 py-2 rounded font-medium transition duration-200"
          >
            Clear Filters
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="flex justify-center items-center h-[45vh]">
            <p className="text-center text-gray-500 mt-32">
              🚫 No events match your filter criteria.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="cursor-pointer"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
