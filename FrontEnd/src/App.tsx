import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NotFound from "./components/NotFoud";
import Home from "./components/Home";
import DepartamentosList from "./components/DepartamentosList";
import PrediosList from "./components/PrediosList";
import BensList from "./components/BensList";
import ConferenciasList from "./components/ConferenciasList";
import { useUser } from "./context/userContext";
import Navbar from "./components/Navbar";
import SalasList from "./components/SalasList";
import FuncionariosList from "./components/FuncionariosList";

function App() {

  const { user } = useUser();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<NotFound />} />
        <Route path="/predios" element={<PrediosList />} />
        <Route path="/predio/:nome" element={<SalasList />} />
        <Route path="/departamentos" element={<DepartamentosList />} />
        {/* <Route path="/salas" element={<SalasList />} /> */}
        <Route path="/predio/:nome/sala/:sigla" element={<BensList />} />
        <Route path="/bens" element={<BensList />} />
        <Route path="/funcionarios" element={<FuncionariosList />} />
        <Route path="/conferencias" element={<ConferenciasList />} />
      </Routes>
    </>
  )
}

export default App
