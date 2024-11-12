
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import GoogleButton from "react-google-button";
import "../styles/Roboto.css";
import "../styles/Login.css";


export default function Login() {

    const singInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            console.log(token, user);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        });
    }

return (
    <div className="container">
        <div>
            <div className="logo">
                <h1 className="roboto-regular title">Bem vindo ao Apicelady!</h1>
                <br/>
                <p className="roboto-regular">Primeiro, faça login com sua conta Google</p>
            </div>
            <div className="googleButton">
                <GoogleButton onClick={singInWithGoogle}/>
            </div>
        </div>
    </div>
)
}