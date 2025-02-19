import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/authenticate/Authenticate";
import GuestRoute from "./routes/GuestRoutes";
import SemiProtectedRoute from "./routes/SemiProtectedRoute";
import Activate from "./pages/activate/Activate";
import ProtectedRoute from "./routes/ProtectedRoute";
import Rooms from "./pages/Rooms/Rooms";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<GuestRoute element={<Home />} />} />
        <Route
          path="/authenticate"
          element={<GuestRoute element={<Authenticate />} />}
        />
        <Route
          path="/activate"
          element={<SemiProtectedRoute element={<Activate />} />}
        />
        <Route path="/rooms" element={<ProtectedRoute element={<Rooms />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
