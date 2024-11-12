
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import GoogleButton from "react-google-button";
import "../styles/Roboto.css";
import "../styles/Login.css";


export default function Login() {

    const singInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (error) {
            console.error(error)
        }
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