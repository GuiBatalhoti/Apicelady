import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NotFound from "./components/NotFoud";

function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
