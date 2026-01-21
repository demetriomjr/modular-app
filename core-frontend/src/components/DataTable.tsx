import React, { useState, useMemo } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    TableContainer,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export interface Column<T> {
    id: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
}

interface DataTableProps<T> {
    title: string;
    columns: Column<T>[];
    data: T[];
    onAdd?: () => void;
    addButtonLabel?: string;
    renderActions?: (item: T) => React.ReactNode;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

const DataTable = <T extends { id?: string | number }>({
    title,
    columns,
    data,
    onAdd,
    addButtonLabel = 'Adicionar',
    renderActions,
    searchPlaceholder = 'Pesquisar...',
    emptyMessage = 'Nenhum registro encontrado.',
}: DataTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }

        const lowerTerm = searchTerm.toLowerCase();

        return data.filter((item) => {
            return columns.some((col) => {
                const value = (item as any)[col.id];
                if (value == null) return false;
                return String(value).toLowerCase().includes(lowerTerm);
            });
        });
    }, [data, searchTerm, columns]);

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                {onAdd && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onAdd}
                        startIcon={<span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>}
                    >
                        {addButtonLabel}
                    </Button>
                )}
            </Box>

            {/* Toolbar */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }} elevation={0}>
                <TextField
                    size="small"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ width: '100%', overflow: 'hidden', border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={String(col.id)}
                                    align={col.align || 'left'}
                                    sx={{ minWidth: col.minWidth }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                            {renderActions && (
                                <TableCell align="right">Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <TableRow key={(row.id as React.Key) || index} hover>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.id)} align={col.align || 'left'}>
                                            {col.render ? col.render(row) : (row as any)[col.id]}
                                        </TableCell>
                                    ))}
                                    {renderActions && (
                                        <TableCell align="right">
                                            {renderActions(row)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} align="center" sx={{ py: 6 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {searchTerm ? 'Nenhum resultado encontrado para a pesquisa.' : emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DataTable;
