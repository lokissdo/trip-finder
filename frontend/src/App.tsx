import "./App.css";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Attraction from "./pages/Explore/MultiSelection/Attraction";
import Restaurant from "./pages/Explore/MultiSelection/Restaurant";
import Vehicle from "./pages/Explore/MultiSelection/Vehicle";
import Hotel from "./pages/Explore/MultiSelection/Hotel";
const router = createBrowserRouter([{ path: "*", element: <Root /> }]);
function Root() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/attractions" element={<Attraction />} />
      <Route path="/culinary" element={<Restaurant />} />
      <Route path="/transportations" element={<Vehicle />} />
      <Route path="/hotels" element={<Hotel />} />
    </Routes>
  );
}
function App() {
  return <RouterProvider router={router} />;
}

export default App;
