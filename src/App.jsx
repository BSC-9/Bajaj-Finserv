import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp"; // Assuming you have a Home component
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/SignUp" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
