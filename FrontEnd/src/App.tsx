import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import Login from "./components/Login";
import NotFound from "./components/NotFoud";
import Home from "./components/Home";

function App() {

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </UserProvider>
  )
}

export default App
