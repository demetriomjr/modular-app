import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import api from '../api/api';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        const res = await api.get('/suppliers');
        setSuppliers(res.data);
    };

    const handleSubmit = async () => {
        await api.post('/suppliers', formData);
        setOpen(false);
        setFormData({ name: '', email: '', phone: '' });
        fetchSuppliers();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
    };

    const columns: Column<Supplier>[] = [
        { id: 'name', label: 'Nome', render: (s) => <span style={{ fontWeight: 500 }}>{s.name}</span> },
        { id: 'email', label: 'E-mail' },
        { id: 'phone', label: 'Telefone' },
    ];

    return (
        <>
            <DataTable
                title="Fornecedores"
                columns={columns}
                data={suppliers}
                onAdd={() => setOpen(true)}
                addButtonLabel="Adicionar Fornecedor"
                renderActions={(s) => (
                    <Button size="small" color="error" onClick={() => handleDelete(s.id)}>Excluir</Button>
                )}
                emptyMessage="Nenhum fornecedor encontrado. Clique em 'Adicionar Fornecedor' para criar um."
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Fornecedor</DialogTitle>
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

export default Suppliers;

