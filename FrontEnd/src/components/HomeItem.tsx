import { useNavigate } from 'react-router-dom';
import { HomeItemProps } from '../types/HomeItemProps';
import "../styles/HomeItem.css";
import { Typography } from '@mui/material';

export default function HomeItem({ icon, label, path }: HomeItemProps) {
    const navigate = useNavigate();

    return (
        <div className="home-item" onClick={() => navigate(path)}>
            {icon}
            <Typography component="p" >
                {label}
            </Typography>
        </div>
    )
}