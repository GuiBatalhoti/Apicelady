import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import DepartamentosList from "./components/DepartamentosList";
import PrediosList from "./components/PrediosList";
import BensList from "./components/BensList";
import ConferenciasList from "./components/ConferenciasList";
import { useUser } from "./context/userContext";
import Navbar from "./components/Navbar";
import SalasList from "./components/SalasList";
import FuncionariosList from "./components/FuncionariosList";
import NotFound from "./components/NotFoud";
import BensConferidosList from "./components/BensConferidosList";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();

  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user } = useUser();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Rotas protegidas */}
        <Route path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/predios"
          element={
            <ProtectedRoute>
              <PrediosList />
            </ProtectedRoute>
          }
        />
        <Route path="/predio/:nome"
          element={
            <ProtectedRoute>
              <SalasList />
            </ProtectedRoute>
          }
        />
        <Route path="/departamentos"
          element={
            <ProtectedRoute>
              <DepartamentosList />
            </ProtectedRoute>
          }
        />
        <Route path="/departamento/:sigla/funcionarios"
          element={
            <ProtectedRoute>
              <FuncionariosList />
            </ProtectedRoute>
          }
        />
        <Route path="/predio/:nome/sala/:sigla"
          element={
            <ProtectedRoute>
              <BensList />
            </ProtectedRoute>
          }
        />
        <Route path="/bens"
          element={
            <ProtectedRoute>
              <BensList />
            </ProtectedRoute>
          }
        />
        <Route path="/funcionarios"
          element={
            <ProtectedRoute>
              <FuncionariosList />
            </ProtectedRoute>
          }
        />
        <Route path="/conferencias"
          element={
            <ProtectedRoute>
              <ConferenciasList />
            </ProtectedRoute>
          }
        />
        <Route path="/conferencia/:dataRealizacao/:tipo/:local"
          element={
            <ProtectedRoute>
              <BensConferidosList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
