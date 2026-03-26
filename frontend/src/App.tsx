import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import SignInPage from "./pages/SignInPage.tsx";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </>
  );
}

export default App
