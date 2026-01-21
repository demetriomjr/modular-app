import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import api from '../api/api';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const res = await api.get('/customers');
        setCustomers(res.data);
    };

    const handleSubmit = async () => {
        await api.post('/customers', formData);
        setOpen(false);
        setFormData({ name: '', email: '', phone: '' });
        fetchCustomers();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
    };

    const columns: Column<Customer>[] = [
        { id: 'name', label: 'Nome', render: (c) => <span style={{ fontWeight: 500 }}>{c.name}</span> },
        { id: 'email', label: 'E-mail' },
        { id: 'phone', label: 'Telefone' },
    ];

    return (
        <>
            <DataTable
                title="Clientes"
                columns={columns}
                data={customers}
                onAdd={() => setOpen(true)}
                addButtonLabel="Adicionar Cliente"
                renderActions={(c) => (
                    <Button size="small" color="error" onClick={() => handleDelete(c.id)}>Excluir</Button>
                )}
                emptyMessage="Nenhum cliente encontrado. Clique em 'Adicionar Cliente' para criar um."
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Cliente</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Nome" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} variant="outlined" />
                    <TextField fullWidth label="E-mail" margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} variant="outlined" />
                    <TextField fullWidth label="Telefone" margin="normal" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} variant="outlined" />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Customers;

