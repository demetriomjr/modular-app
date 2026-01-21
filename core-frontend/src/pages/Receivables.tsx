import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem } from '@mui/material';
import api from '../api/api';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';

interface Receivable {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'PAID' | 'OPEN';
    paymentMethod: string;
    installments: number;
}

interface PaymentMethod {
    id: string;
    name: string;
}

const Receivables = () => {
    const [receivables, setReceivables] = useState<Receivable[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ description: '', amount: 0, dueDate: '', paymentMethod: '', installments: 1 });

    useEffect(() => {
        fetchReceivables();
        fetchPaymentMethods();
    }, []);

    const fetchReceivables = async () => {
        const res = await api.get('/account-receivables');
        setReceivables(res.data);
    };

    const fetchPaymentMethods = async () => {
        const res = await api.get('/payment-methods');
        setPaymentMethods(res.data);
    };

    const handleSubmit = async () => {
        await api.post('/account-receivables', {
            ...formData,
            amount: Number(formData.amount),
            dueDate: new Date(formData.dueDate).toISOString()
        });
        setOpen(false);
        setFormData({ description: '', amount: 0, dueDate: '', paymentMethod: '', installments: 1 });
        fetchReceivables();
    };

    const handleToggleStatus = async (item: Receivable) => {
        const nextStatus = item.status === 'OPEN' ? 'PAID' : 'OPEN';
        await api.patch(`/account-receivables/${item.id}`, { status: nextStatus });
        fetchReceivables();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/account-receivables/${id}`);
        fetchReceivables();
    };

    const translateStatus = (status: string) => {
        return status === 'PAID' ? 'PAGO' : 'ABERTO';
    };

    const columns: Column<Receivable>[] = [
        { id: 'description', label: 'Descrição', render: (r) => <span style={{ fontWeight: 500 }}>{r.description}</span> },
        { id: 'amount', label: 'Valor', render: (r) => `R$ ${r.amount.toFixed(2)}` },
        { id: 'dueDate', label: 'Vencimento', render: (r) => new Date(r.dueDate).toLocaleDateString('pt-BR') },
        {
            id: 'paymentMethod',
            label: 'Forma de Pagamento',
            render: (r) => paymentMethods.find(pm => pm.id === r.paymentMethod)?.name || r.paymentMethod
        },
        { id: 'installments', label: 'Parc.', render: (r) => `${r.installments}x` },
        {
            id: 'status', label: 'Status', render: (r) => (
                <Button
                    size="small"
                    variant="outlined"
                    color={r.status === 'PAID' ? 'success' : 'warning'}
                    onClick={() => handleToggleStatus(r)}
                >
                    {translateStatus(r.status)}
                </Button>
            )
        },
    ];

    return (
        <>
            <DataTable
                title="Contas a Receber"
                columns={columns}
                data={receivables}
                onAdd={() => setOpen(true)}
                addButtonLabel="Adicionar Conta"
                renderActions={(r) => (
                    <Button size="small" color="error" onClick={() => handleDelete(r.id)}>Excluir</Button>
                )}
                emptyMessage="Nenhuma conta a receber encontrada. Clique em 'Adicionar Conta' para criar uma."
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Conta</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Descrição" margin="normal" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} variant="outlined" />
                    <TextField fullWidth label="Valor" type="number" margin="normal" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} variant="outlined" />
                    <TextField fullWidth label="Data de Vencimento" type="date" InputLabelProps={{ shrink: true }} margin="normal" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} variant="outlined" />
                    <TextField
                        fullWidth
                        select
                        label="Forma de Pagamento"
                        margin="normal"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        variant="outlined"
                        required
                    >
                        {paymentMethods.map((pm) => (
                            <MenuItem key={pm.id} value={pm.id}>
                                {pm.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        type="number"
                        label="Parcelas"
                        margin="normal"
                        value={formData.installments}
                        onChange={(e) => setFormData({ ...formData, installments: Math.max(1, Number(e.target.value)) })}
                        variant="outlined"
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Receivables;

