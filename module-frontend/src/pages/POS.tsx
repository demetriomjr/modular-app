import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardActionArea, CardContent, Button, IconButton, Divider, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Checkbox, List, ListItem, ListItemText, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, History, ArrowBack } from '@mui/icons-material';
import api, { coreApi } from '../api/api';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface PaymentMethod {
    id: string;
    name: string;
}

interface SaleItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: Product;
}

interface Sale {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    installments: number;
    isPaid: boolean;
    createdAt: string;
    items: SaleItem[];
}

const POS = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState({ paymentMethod: '', installments: 1, isPaid: false });
    const [historyOpen, setHistoryOpen] = useState(false);
    const [sales, setSales] = useState<Sale[]>([]);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchPaymentMethods();
    }, []);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const res = await coreApi.get('/payment-methods');
            setPaymentMethods(res.data);
        } catch (error) {
            console.error("Failed to fetch payment methods", error);
        }
    };

    const fetchSales = async () => {
        try {
            const res = await api.get('/sales');
            setSales(res.data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        }
    };

    const handleOpenHistory = () => {
        fetchSales();
        setHistoryOpen(true);
        setSelectedSale(null);
    };

    const handleSelectSale = (sale: Sale) => {
        setSelectedSale(sale);
    };

    const handleBackToList = () => {
        setSelectedSale(null);
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        setCheckoutOpen(true);
    };

    const confirmCheckout = async () => {
        try {
            const items = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));
            // TODO: Send checkoutData along with sale
            await api.post('/sales', {
                items,
                paymentMethod: checkoutData.paymentMethod,
                installments: checkoutData.installments,
                isPaid: checkoutData.isPaid
            });
            setSnackbar({ open: true, message: 'Venda realizada com sucesso!', severity: 'success' });
            setCart([]);
            setCheckoutOpen(false);
            setCheckoutData({ paymentMethod: '', installments: 1, isPaid: false });
            fetchProducts(); // Refresh stock
        } catch (error) {
            console.error("Checkout failed", error);
            setSnackbar({ open: true, message: 'Erro ao finalizar venda.', severity: 'error' });
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 2 }}>
            {/* Product Grid */}
            <Paper sx={{ flex: 2, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Produtos</Typography>
                <Grid container spacing={2}>
                    {products.map(product => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                            <Card sx={{ bgcolor: 'background.paper' }}>
                                <CardActionArea onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="h6">{product.name}</Typography>
                                        <Typography variant="h5" color="primary.main" sx={{ my: 1 }}>
                                            R$ {Number(product.price).toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" color={product.stock > 0 ? 'text.secondary' : 'error'}>
                                            Estoque: {product.stock}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Cart Sidebar */}
            <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart /> Carrinho
                </Typography>

                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    {cart.map(item => (
                        <Box key={item.id} sx={{ mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1">{item.name}</Typography>
                                <Typography variant="subtitle1">R$ {(item.price * item.quantity).toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}><Remove fontSize="small" /></IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}><Add fontSize="small" /></IconButton>
                                </Box>
                                <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                    {cart.length === 0 && (
                        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>Carrinho vazio</Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h5" color="primary.main">R$ {total.toFixed(2)}</Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<History />}
                    onClick={handleOpenHistory}
                    sx={{ mb: 2 }}
                >
                    Histórico de Vendas
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    color="primary"
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                >
                    Finalizar Venda
                </Button>
            </Paper>

            <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Finalizar Venda</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Total: R$ {total.toFixed(2)}
                    </Typography>
                    <TextField
                        fullWidth
                        select
                        label="Forma de Pagamento"
                        margin="normal"
                        value={checkoutData.paymentMethod}
                        onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
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
                        value={checkoutData.installments}
                        onChange={(e) => setCheckoutData({ ...checkoutData, installments: Math.max(1, Number(e.target.value)) })}
                        variant="outlined"
                        inputProps={{ min: 1 }}
                    />
                    {checkoutData.installments > 1 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Valor por parcela: R$ {(total / checkoutData.installments).toFixed(2)}
                        </Typography>
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkoutData.isPaid}
                                onChange={(e) => setCheckoutData({ ...checkoutData, isPaid: e.target.checked })}
                            />
                        }
                        label="Venda paga"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCheckoutOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={confirmCheckout}
                        variant="contained"
                        disabled={!checkoutData.paymentMethod}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={historyOpen} onClose={() => { setHistoryOpen(false); setSelectedSale(null); }} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedSale ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton onClick={handleBackToList}>
                                <ArrowBack />
                            </IconButton>
                            Detalhes da Venda #{selectedSale.id.substring(0, 8)}
                        </Box>
                    ) : 'Histórico de Vendas'}
                </DialogTitle>
                <DialogContent dividers>
                    {!selectedSale ? (
                        <List>
                            {sales.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Nenhuma venda registrada.</Typography>
                            ) : (
                                sales.map((sale) => (
                                    <Paper
                                        key={sale.id}
                                        sx={{
                                            mb: 1,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                        onClick={() => handleSelectSale(sale)}
                                    >
                                        <ListItem>
                                            <ListItemText
                                                primary={`R$ ${Number(sale.totalAmount).toFixed(2)}`}
                                                secondary={`${new Date(sale.createdAt).toLocaleString('pt-BR')} - ${sale.items.length} item(ns)`}
                                            />
                                        </ListItem>
                                    </Paper>
                                ))
                            )}
                        </List>
                    ) : (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Informações da Venda</Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography><strong>Total:</strong> R$ {Number(selectedSale.totalAmount).toFixed(2)}</Typography>
                                <Typography><strong>Data:</strong> {new Date(selectedSale.createdAt).toLocaleString('pt-BR')}</Typography>
                                <Typography><strong>Forma de Pagamento:</strong> {paymentMethods.find(pm => pm.id === selectedSale.paymentMethod)?.name || selectedSale.paymentMethod}</Typography>
                                <Typography><strong>Parcelas:</strong> {selectedSale.installments}x de R$ {(Number(selectedSale.totalAmount) / selectedSale.installments).toFixed(2)}</Typography>
                                <Typography><strong>Status:</strong> {selectedSale.isPaid ? 'Pago' : 'Pendente'}</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>Itens</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="right">Qtd</TableCell>
                                        <TableCell align="right">Preço Unit.</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedSale.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">R$ {Number(item.unitPrice).toFixed(2)}</TableCell>
                                            <TableCell align="right">R$ {Number(item.total).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => { setHistoryOpen(false); setSelectedSale(null); }}>Fechar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export const ModuleIcon = 'Storefront';
export default POS;
