import Navbar from "./Navbar";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {

    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user])

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Bem vindo, {user?.email}!</h1>
            </div>
        </div>
    )
}