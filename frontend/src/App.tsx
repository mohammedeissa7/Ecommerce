import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import Footer from "./components/Footer.tsx";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App
