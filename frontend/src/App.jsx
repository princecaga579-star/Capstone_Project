
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Memberships from "./pages/Memberships.jsx";
import WorkoutPrograms from "./pages/WorkoutPrograms.jsx";
import Exercises from "./pages/Exercises.jsx";
import WorkoutLogs from "./pages/WorkoutLogs.jsx";

function PrivatePage({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivatePage>
              <Dashboard />
            </PrivatePage>
          }
        />

        <Route
          path="/memberships"
          element={
            <PrivatePage>
              <Memberships />
            </PrivatePage>
          }
        />

        <Route
          path="/workout-programs"
          element={
            <PrivatePage>
              <WorkoutPrograms />
            </PrivatePage>
          }
        />

        <Route
          path="/exercises"
          element={
            <PrivatePage>
              <Exercises />
            </PrivatePage>
          }
        />

        <Route
          path="/workout-logs"
          element={
            <PrivatePage>
              <WorkoutLogs />
            </PrivatePage>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
