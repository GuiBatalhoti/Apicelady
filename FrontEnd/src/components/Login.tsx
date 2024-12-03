
import { signInWithPopup } from "firebase/auth";
import { auth, getAllFromCollection, googleProvider } from "../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import GoogleButton from "react-google-button";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Funcionario } from "../types/DataStructures/Funcionario";

export default function Login() {

  let { login } = useUser();
  const navigate = useNavigate();

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    if (checkLocalStorage()) {
      navigate("/home");
      return
    }
    getAllFromCollection("funcionario").then((data: any[]) => {
      const funcionarios: Funcionario[] = data.map((doc) => ({
        docId: doc.id,
        nome: doc.nome,
        email: doc.email,
        endereco: doc.endereco,
        deptoSigla: doc.deptoSigla,
        cargo: doc.cargo,
        funcao: doc.funcao,
      }));
      setFuncionarios(funcionarios);
    })
  }, [])

  const checkLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (user) {
      return true;
    }
    return false
  }

  const singInWithGoogle = async () => {
    if (!checkLocalStorage()) {
      await signInWithPopup(auth, googleProvider).then((result) => {
        funcionarios?.forEach((funcionario) => {
          if (funcionario.email === result.user.email) {
            localStorage.setItem("user", JSON.stringify(result.user));
            login(result.user);
            navigate("/home");
          }
          else {
            alert("Usuário não cadastrado.Por favor, entre em contato com o administrador do sistema.");
          }
        })
      }).catch((error) => {
        console.log(error.code, error.message, error.email, GoogleAuthProvider.credentialFromError(error));
      });
      return;
    }
    navigate("/home");
  }

  return (
    <div className="container">
      <div>
        <div className="logo">
          <AccountBalanceIcon style={{ fontSize: 150, marginBottom: '5px' }} />
          <Typography variant="h3" component="div" sx={{ marginLeft: 'auto' }}>
            Bem vindo ao Apicelady!
          </Typography>
          <Typography variant="h6" component="div" sx={{ marginLeft: 'auto' }}>
            Primeiro, faça login com sua conta Google
          </Typography>
        </div>
        <div className="googleButton">
          <GoogleButton onClick={singInWithGoogle} />
        </div>
      </div>
    </div>
  )
}