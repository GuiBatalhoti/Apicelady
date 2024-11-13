import Navbar from "./Navbar";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {

    const { user, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Bem vindo, {user?.email}!</h1>
            </div>
        </div>
    )
}