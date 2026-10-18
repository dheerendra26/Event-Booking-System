import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchEvents = (userId, role, page = 1, limit = 9, filters = {}) =>
  API.get("/events", {
    params: {
      userId,
      role,
      page,
      limit,
      location: (filters.location || "").trim(),
      category: filters.category || "",
      priceRange: filters.priceRange || "",
      search: (filters.search || "").trim(),
      date: filters.date || "",
    },
  });

export const fetchEventById = (id) => API.get(`/events/${id}`);
export const bookEvent = (event_id, number_of_people = 1) =>
  API.post("/bookings", { event_id, number_of_people });

export const login = (credentials) => API.post("/users/login", credentials);
export const register = (data) => API.post("/users/register", data);
export const fetchMyBookings = () => API.get("/bookings/me");
export const fetchAllBookings = (
  userId,
  role,
  page = 1,
  limit = 10,
  filters = {},
) =>
  API.get("/bookings/admin", {
    params: {
      userId,
      role,
      page,
      limit,
      search: (filters.search || "").trim(),
      location: (filters.location || "").trim(),
      date: filters.date || "",
    },
  });

export const checkBooking = (userId, eventId) =>
  API.get(`/bookings/check-booking/${userId}/${eventId}`);

export const cancelBooking = (userId, eventId) =>
  API.delete(`/bookings/cancel-booking/${userId}/${eventId}`);

export const getAvailableSeats = (eventId) =>
  API.get(`/bookings/available-seats/${eventId}`);

export const fetchReviews = (eventId) => API.get(`/reviews/${eventId}`);

export const deleteEvent = (id) => API.delete(`/events/delete-event/${id}`);

export default API;
