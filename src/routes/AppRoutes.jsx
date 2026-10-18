import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MyBookings from "../pages/MyBookings";
import CreateEvent from "../pages/admin/CreateEvent";
import EventDetails from "../pages/EventDetails";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Events from "../pages/Events";
import CreateUser from "../pages/admin/CreateUser";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import AllBookingsList from "../pages/admin/AllBookingsList";
import EditEvent from "../pages/admin/EditEvent";
import AllEventsList from "../pages/admin/AllEventsList";
import EventSummary from "../pages/admin/EventSummary";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event/:id" element={<EventDetails />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <UserRoutes>
            <MyBookings />
          </UserRoutes>
        }
      />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="all-bookings" element={<AllBookingsList />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="all-events" element={<AllEventsList />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="event-summary/:id" element={<EventSummary />} />
          <Route index element={<AllBookingsList />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
