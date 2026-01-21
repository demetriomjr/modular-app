import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8', // Pastel Indigo
            light: '#a5b4fc',
            dark: '#6366f1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f472b6', // Pastel Pink
            light: '#fbcfe8',
            dark: '#db2777',
            contrastText: '#ffffff',
        },
        background: {
            default: '#1e293b', // Deep Slate
            paper: '#334155', // Lighter Slate
        },
        text: {
            primary: '#f8fafc', // White-ish slate
            secondary: '#cbd5e1', // Light slate
        },
        divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#ffffff',
        },
        h6: {
            fontWeight: 600,
            color: '#ffffff',
        },
        body1: {
            color: '#e2e8f0',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 6, // Reduced radius for a cleaner look
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                    },
                },
                contained: {
                    color: '#ffffff',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#334155',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: '#475569',
                    color: '#f1f5f9',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                },
                root: {
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    margin: '4px 8px',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(129, 140, 248, 0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(129, 140, 248, 0.3)',
                        },
                        '& .MuiListItemIcon-root': {
                            color: '#818cf8',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: '#94a3b8',
                    minWidth: 40,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#334155',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#cbd5e1',
                    '&.Mui-focused': {
                        color: '#818cf8',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                        borderColor: '#94a3b8',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#818cf8',
                    },
                    color: '#ffffff',
                },
            },
        },
    },
});

export default theme;
