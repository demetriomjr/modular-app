import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, ErrorOutline } from '@mui/icons-material';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 3
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    maxWidth: 500,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <ErrorOutline sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5 }} />

                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Página não encontrada
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        A página que você está procurando não existe ou foi movida.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                    }}
                >
                    Voltar para o Painel
                </Button>
            </Paper>
        </Box>
    );
};

export default NotFound;
