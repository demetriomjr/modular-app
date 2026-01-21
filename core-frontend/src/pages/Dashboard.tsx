import { Typography, Paper, Box, Grid } from '@mui/material';
import { Business, People, ShoppingCart, Receipt } from '@mui/icons-material';

const Dashboard = () => {
    // We define colors for the accent/icon, not the whole background, to fit the dark theme.
    const stats = [
        {
            label: 'Fornecedores',
            value: '42',
            icon: <Business fontSize="large" sx={{ color: '#818cf8' }} />, // Indigo
            bgColor: 'rgba(129, 140, 248, 0.15)',
            borderColor: '#818cf8'
        },
        {
            label: 'Clientes',
            value: '1.024',
            icon: <People fontSize="large" sx={{ color: '#f472b6' }} />, // Pink
            bgColor: 'rgba(244, 114, 182, 0.15)',
            borderColor: '#f472b6'
        },
        {
            label: 'Pedidos',
            value: '580',
            icon: <ShoppingCart fontSize="large" sx={{ color: '#34d399' }} />, // Emerald
            bgColor: 'rgba(52, 211, 153, 0.15)',
            borderColor: '#34d399'

        },
        {
            label: 'Receita',
            value: 'R$ 12.450',
            icon: <Receipt fontSize="large" sx={{ color: '#fbbf24' }} />, // Amber
            bgColor: 'rgba(251, 191, 36, 0.15)',
            borderColor: '#fbbf24'
        },
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                Painel
            </Typography>
            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 4px 20px 0 rgba(0,0,0,0.12), 0 0 0 1px ${stat.bgColor}`
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: stat.bgColor,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {stat.icon}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                                {stat.label.toUpperCase()}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, minHeight: 300 }}>
                        <Typography variant="h6" gutterBottom>Atividade Recente</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.secondary', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 1 }}>
                            Nenhuma atividade recente para exibir
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, minHeight: 300 }}>
                        <Typography variant="h6" gutterBottom>Notificações</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.secondary', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 1 }}>
                            Tudo em dia!
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
