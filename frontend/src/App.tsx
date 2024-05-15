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
const router = createBrowserRouter([{ path: "*", element: <Root /> }]);
function Root() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  );
}
function App() {
  return <RouterProvider router={router} />;
}

export default App;
