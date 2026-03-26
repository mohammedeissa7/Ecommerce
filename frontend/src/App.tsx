import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App
