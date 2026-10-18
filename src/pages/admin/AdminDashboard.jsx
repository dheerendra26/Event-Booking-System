import { NavLink, Outlet } from "react-router-dom";
import Footer from "../../components/Footer";

const AdminDashboard = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-60 bg-gray-100 border-b md:border-b-0 md:border-r p-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <NavLink
            to="/admin/all-bookings"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            📋 All Bookings
          </NavLink>
          <NavLink
            to="/admin/create-event"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            🗓️ Create Event
          </NavLink>
          <NavLink
            to="/admin/create-user"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            👤 Create User
          </NavLink>
          <NavLink
            to="/admin/all-events"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            📝 All Events
          </NavLink>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
