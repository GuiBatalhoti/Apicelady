import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NotFound from "./components/NotFoud";
import Home from "./components/Home";
import Departamentos from "./components/Departamentos";
import Predios from "./components/Predios";
import Bens from "./components/Bens";
import Funcionarios from "./components/Funcionarios";
import Conferencias from "./components/Conferencias";
import { useUser } from "./context/userContext";
import Navbar from "./components/Navbar";

function App() {

  const { user } = useUser();

  return (
    <>
      {user &&<Navbar/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<NotFound />} />
        <Route path="/predios" element={<Predios />} />
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/bens" element={<Bens />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/conferencias" element={<Conferencias />} />
      </Routes>
    </>
  )
}

export default App
