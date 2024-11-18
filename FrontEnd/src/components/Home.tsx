import HomeNavbar from "./HomeNavbar";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import HomeItem from "./HomeItem";
import ComputerIcon from '@mui/icons-material/Computer';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
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
        <div>
            <HomeNavbar />
            
            <div className="home-page">
                <div className="home-items">
                    <HomeItem icon={<ApartmentIcon />} label="Prédios" path="/predios" />
                    <HomeItem icon={<StoreIcon />} label="Departamentos" path="/departamentos" />
                    <HomeItem icon={<MeetingRoomIcon />} label="Salas" path="/Salas" />
                    <HomeItem icon={<ComputerIcon />} label="Bens" path="/bens" />
                    <HomeItem icon={<PersonIcon />} label="Funcionários" path="/funcionarios" />
                    <HomeItem icon={<AddToQueueIcon />} label="Conferências" path="/conferencias" />
                    {/* <HomeItem icon={<ApartmentIcon />} label="Departamentos" path="/departamentos" /> */}
                </div>
            </div>
        </div>
    )
}