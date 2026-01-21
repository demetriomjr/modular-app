import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tabs, Tab, Box, FormControlLabel, Checkbox, MenuItem, Select, FormControl, InputLabel, Paper, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import api from '../api/api';
import { useModules, type ModuleDefinition } from '../contexts/ModuleContext';

interface User {
    id: string;
    username: string;
    name: string;
    createdAt: string;
    modules?: ModuleDefinition[];
}

const MENU_GROUPS = [
    { value: '', label: 'Nenhum (Top Level)' },
    { value: 'Cadastros', label: 'Cadastros' },
    { value: 'Vendas', label: 'Vendas' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Empresa', label: 'Empresa' },
];

const Users = () => {
    const { refreshModules } = useModules();
    const [allModules, setAllModules] = useState<ModuleDefinition[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchAllModules();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const fetchAllModules = async () => {
        try {
            const res = await api.get('/modules/all');
            setAllModules(res.data);
        } catch (error) {
            console.error('Failed to fetch modules', error);
        }
    };

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormData({ name: '', username: '', password: '' });
        setSelectedModuleIds([]);
        setTabValue(0);
        setOpen(true);
    }

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, username: user.username, password: '' });
        setSelectedModuleIds(user.modules?.map(m => m.id) || []);
        setTabValue(0);
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            let userId = editingUser?.id;

            if (editingUser) {
                // Update user logic here if extending API to support PUT /users/:id 
                // For this task, we focus on modules binding mainly, but let's say we had update name logic
                // await api.put(`/users/${userId}`, formData); 
            } else {
                const res = await api.post('/users', formData);
                userId = res.data.id;
            }

            if (userId) {
                await api.post(`/users/${userId}/modules`, { moduleIds: selectedModuleIds });

                // If editing my own modules, refresh the sidebar immediately
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (userId === currentUser.id) {
                    await refreshModules();
                }
            }

            setOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const toggleModule = (moduleId: string) => {
        setSelectedModuleIds(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const updateModuleField = async (moduleId: string, field: 'menuGroup' | 'icon', value: string | null) => {
        try {
            await api.patch(`/modules/${moduleId}`, { [field]: value || null });
            // Refresh modules
            fetchAllModules();
        } catch (error) {
            console.error('Failed to update module', error);
        }
    };

    const columns: Column<User>[] = [
        { id: 'name', label: 'Nome', render: (u) => <span style={{ fontWeight: 500 }}>{u.name}</span> },
        { id: 'username', label: 'Usuário' },
        { id: 'createdAt', label: 'Criado em', render: (u) => new Date(u.createdAt).toLocaleDateString('pt-BR') },
    ];

    return (
        <>
            <DataTable
                title="Usuários"
                columns={columns}
                data={users}
                onAdd={handleOpenAdd}
                addButtonLabel="Adicionar Usuário"
                renderActions={(u) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" onClick={() => handleOpenEdit(u)}>Editar</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(u.id)}>Excluir</Button>
                    </Box>
                )}
                emptyMessage="Nenhum usuário encontrado."
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
                <DialogContent dividers>
                    <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
                        <Tab label="Cadastro" />
                        <Tab label="Módulos" />
                    </Tabs>

                    {tabValue === 0 && (
                        <>
                            <TextField fullWidth label="Nome" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} variant="outlined" />
                            <TextField fullWidth label="Usuário" margin="normal" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} variant="outlined" disabled={!!editingUser} />
                            <TextField fullWidth label={editingUser ? "Nova Senha (opcional)" : "Senha"} type="password" margin="normal" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} variant="outlined" />
                        </>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Selecione os módulos que o usuário terá acesso e configure onde aparecerão no menu.
                            </Typography>
                            {allModules.map((mod) => (
                                <Paper key={mod.id} sx={{ p: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedModuleIds.includes(mod.id)}
                                                    onChange={() => toggleModule(mod.id)}
                                                />
                                            }
                                            label={<Box>
                                                <Typography variant="body1" fontWeight="bold">{mod.menuLabel || mod.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{mod.route}</Typography>
                                            </Box>}
                                            sx={{ flex: 1 }}
                                        />
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <InputLabel>Grupo do Menu</InputLabel>
                                            <Select
                                                value={mod.menuGroup || ''}
                                                label="Grupo do Menu"
                                                onChange={(e) => updateModuleField(mod.id, 'menuGroup', e.target.value)}
                                            >
                                                {MENU_GROUPS.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Users;
