import { AppBar, Toolbar, IconButton, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function HomeNavbar() {

    const navigate = useNavigate();
    const { user, logout } = useUser();

    const handleClick = (buttonName: string) => {
        if (buttonName === "home") return () => navigate("/home");
        if (buttonName === "sobre") return () => navigate("/sobre");
        if (buttonName === "logout") return () => {
            logout()
            navigate("/login");
        };
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="name" size="large">
                    <AccountBalanceIcon style={{marginRight:"5px"}}/>
                    Apicelady
                </IconButton>
                <Stack direction="row" spacing={2}>
                    <Button color="inherit" id="home-button" onClick={handleClick("home")}>Home</Button>
                    <Button color="inherit" id="sobre-button" onClick={handleClick("sobre")}>Sobre</Button>
                    <Button color="inherit" id="logout-button" onClick={handleClick("logout")}>Sair</Button>
                </Stack>
                <Typography component="div" sx={{ marginLeft: 'auto' }}>
                    {user?.email}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}