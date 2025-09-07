import { Routes, Route } from "react-router-dom";
import Body from "./pages/Body";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
