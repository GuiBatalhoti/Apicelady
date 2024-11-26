import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navega para a página inicial
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      sx={{ backgroundColor: "#f5f5f5", padding: 3 }}
    >
      <Typography variant="h1" color="error" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" marginBottom={2}>
        Página não encontrada
      </Typography>
      <Typography variant="body1" marginBottom={4}>
        Parece que você tentou acessar uma página que não existe ou foi movida.
      </Typography>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={handleGoHome}
      >
        Voltar para a página inicial
      </Button>
    </Box>
  );
};

export default NotFound;
