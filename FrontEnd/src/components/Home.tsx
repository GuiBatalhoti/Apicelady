import Navbar from "./Navbar";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeItem from "./HomeItem";
import "../styles/Home.css";


export default function Home() {

    const { user, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="home-items">
                {/* <h1>Bem vindo, {user?.email}!</h1> */}
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
                <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" />
            </div>
        </>
    )
}