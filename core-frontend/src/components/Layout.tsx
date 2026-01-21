import { useState, useMemo, type ReactNode } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Collapse, IconButton, Icon } from '@mui/material';
import { People, ShoppingCart, Business, Receipt, Dashboard, ExpandLess, ExpandMore, ListAlt, AttachMoney, FolderShared, Extension, Logout } from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';

const drawerWidth = 240;

// Helper to render dynamic icons using Google Fonts Material Icons
const toSnakeCase = (str: string) => str.split(/(?=[A-Z])/).join('_').toLowerCase();

const DynamicIcon = ({ iconName }: { iconName?: string }) => {
    if (!iconName) return <Extension />;
    return <Icon>{toSnakeCase(iconName)}</Icon>;
};

interface MenuItem {
    text: string;
    icon: ReactNode;
    path?: string;
    children?: MenuItem[];
}

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { modules, refreshModules } = useModules();
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        refreshModules();
        navigate('/login');
    };

    const handleSubmenuClick = (text: string) => {
        setOpenSubmenus((prev) => {
            const isCurrentlyOpen = prev[text];
            // Close all submenus
            const allClosed = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as Record<string, boolean>);
            // Toggle the clicked submenu
            return { ...allClosed, [text]: !isCurrentlyOpen };
        });
    };

    const finalMenu = useMemo(() => {
        const baseMenu: MenuItem[] = [
            {
                text: 'Painel',
                icon: <Dashboard />,
                path: '/'
            },
            {
                text: 'Cadastros',
                icon: <FolderShared />,
                children: [
                    { text: 'Clientes', path: '/customers', icon: <People /> },
                    { text: 'Fornecedores', path: '/suppliers', icon: <Business /> }
                ]
            },
            {
                text: 'Vendas',
                icon: <ShoppingCart />,
                children: [
                    { text: 'Pedidos', path: '/orders', icon: <ListAlt /> }
                ]
            },
            {
                text: 'Financeiro',
                icon: <AttachMoney />,
                children: [
                    { text: 'Contas a Receber', path: '/receivables', icon: <Receipt /> }
                ]
            },
            {
                text: 'Empresa',
                icon: <Business />,
                children: [
                    { text: 'Usuários', path: '/users', icon: <People /> }
                ]
            },
        ];

        // We clone to avoid mutating the base definition on re-renders,
        // although here we are creating it fresh inside useMemo anyway.
        // But since we want to modify it, let's work with the array directly.
        const menu = [...baseMenu];

        modules.forEach(module => {
            const moduleIcon = <DynamicIcon iconName={module.icon} />;

            if (module.menuGroup) {
                let group = menu.find(item => item.text === module.menuGroup);
                if (!group) {
                    group = {
                        text: module.menuGroup,
                        icon: <Extension />,
                        children: []
                    };
                    menu.push(group);
                }

                if (!group.children) {
                    group.children = [];
                }

                // Check if already exists to avoid duplicates if something goes wrong
                if (!group.children.find(c => c.path === module.route)) {
                    group.children.push({
                        text: module.menuLabel,
                        path: module.route,
                        icon: moduleIcon
                    });
                }
            } else {
                // If no group, add as top level item
                menu.push({
                    text: module.menuLabel,
                    path: module.route,
                    icon: moduleIcon
                });
            }
        });

        return menu;
    }, [modules]);

    const user = useMemo(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', flexGrow: 1 }}>
                        ERP Minimalista
                    </Typography>
                    {user && (
                        <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary', fontWeight: 500 }}>
                            Olá, {user.name}
                        </Typography>
                    )}
                    <IconButton color="inherit" onClick={handleLogout} title="Sair">
                        <Logout />
                    </IconButton>
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
                        {finalMenu.map((item) => (
                            <Box key={item.text}>
                                {item.children ? (
                                    <>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => handleSubmenuClick(item.text)}>
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.text} />
                                                {openSubmenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                        </ListItem>
                                        <Collapse in={openSubmenus[item.text]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.children.map((child) => (
                                                    <ListItemButton
                                                        key={child.text}
                                                        sx={{ pl: 4 }}
                                                        selected={location.pathname === child.path}
                                                        onClick={() => navigate(child.path!)}
                                                    >
                                                        <ListItemIcon>{child.icon}</ListItemIcon>
                                                        <ListItemText primary={child.text} />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </>
                                ) : (
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={location.pathname === item.path}
                                            onClick={() => navigate(item.path!)}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </Box>
                        ))}
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
