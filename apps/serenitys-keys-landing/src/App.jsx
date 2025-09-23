import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import SharedFooter from "./components/SharedFooter";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import ScrollToTop from "./components/ScrollToTop";

const App = () => (
  <>
    <ScrollToTop />
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="*" element={<Home />} />
    </Routes>
    <SharedFooter />
  </>
);

export default App;
