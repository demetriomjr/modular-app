
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';
import { PointOfSale, Inventory } from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
                        Module POS
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', py: 2 }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname === '/'} onClick={() => navigate('/')}>
                                <ListItemIcon><PointOfSale /></ListItemIcon>
                                <ListItemText primary="PDV / Caixa" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname === '/products'} onClick={() => navigate('/products')}>
                                <ListItemIcon><Inventory /></ListItemIcon>
                                <ListItemText primary="Produtos" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
