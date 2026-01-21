import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../api/api';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';

interface Order {
    id: string;
    orderNumber: string;
    customer: { name: string } | null;
    date: string;
    totalAmount: number;
    status: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ orderNumber: '', customerId: '', totalAmount: 0 });

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
    }, []);

    const fetchOrders = async () => {
        const res = await api.get('/orders');
        setOrders(res.data);
    };

    const fetchCustomers = async () => {
        const res = await api.get('/customers');
        setCustomers(res.data);
    };

    const handleSubmit = async () => {
        await api.post('/orders', {
            ...formData,
            totalAmount: Number(formData.totalAmount)
        });
        setOpen(false);
        setFormData({ orderNumber: '', customerId: '', totalAmount: 0 });
        fetchOrders();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/orders/${id}`);
        fetchOrders();
    };

    const columns: Column<Order>[] = [
        { id: 'orderNumber', label: 'Número', render: (o) => <span style={{ fontWeight: 500 }}>{o.orderNumber}</span> },
        { id: 'customer', label: 'Cliente', render: (o) => o.customer?.name || '-' },
        { id: 'date', label: 'Data', render: (o) => new Date(o.date).toLocaleDateString('pt-BR') },
        { id: 'totalAmount', label: 'Valor', render: (o) => `R$ ${o.totalAmount.toFixed(2)}` },
        { id: 'status', label: 'Status' },
    ];

    return (
        <>
            <DataTable
                title="Pedidos"
                columns={columns}
                data={orders}
                onAdd={() => setOpen(true)}
                addButtonLabel="Adicionar Pedido"
                renderActions={(o) => (
                    <Button size="small" color="error" onClick={() => handleDelete(o.id)}>Excluir</Button>
                )}
                emptyMessage="Nenhum pedido encontrado. Clique em 'Adicionar Pedido' para criar um."
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Pedido</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Número do Pedido" margin="normal" value={formData.orderNumber} onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })} variant="outlined" />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            value={formData.customerId}
                            label="Cliente"
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        >
                            {customers.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Valor Total" type="number" margin="normal" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })} variant="outlined" />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Orders;

