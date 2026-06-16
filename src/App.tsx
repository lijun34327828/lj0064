import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calculator from "@/pages/Calculator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
      </Routes>
    </Router>
  );
}
