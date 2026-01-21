import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api/api';
import DataTable from 'core_frontend/DataTable';
import type { Column } from 'core_frontend/DataTable';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', price: '', stock: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const handleSave = async () => {
        await api.post('/products', {
            name: form.name,
            price: parseFloat(form.price),
            stock: parseInt(form.stock)
        });
        setOpen(false);
        setForm({ name: '', price: '', stock: '' });
        fetchProducts();
    };

    const columns: Column<Product>[] = [
        { id: 'name', label: 'Nome', render: (p: Product) => <span style={{ fontWeight: 500 }}>{p.name}</span> },
        { id: 'price', label: 'Preço', render: (p: Product) => `R$ ${Number(p.price).toFixed(2)}` },
        { id: 'stock', label: 'Estoque' },
    ];

    return (
        <>
            <DataTable
                title="Gerenciar Produtos"
                columns={columns}
                data={products}
                onAdd={() => setOpen(true)}
                addButtonLabel="Adicionar Produto"
                emptyMessage="Nenhum produto encontrado."
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Novo Produto</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Nome" margin="normal" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <TextField fullWidth label="Preço" type="number" margin="normal" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    <TextField fullWidth label="Estoque" type="number" margin="normal" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const ModuleIcon = 'ShoppingCart'; // Simple string identifier for now
export default Products;

