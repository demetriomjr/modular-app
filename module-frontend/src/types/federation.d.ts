declare module 'core_frontend/DataTable' {
    import type { FC, ReactNode } from 'react';

    export interface Column<T> {
        id: keyof T | string;
        label: string;
        render?: (item: T) => ReactNode;
        align?: 'left' | 'right' | 'center';
        minWidth?: number;
    }

    interface DataTableProps<T> {
        title: string;
        columns: Column<T>[];
        data: T[];
        onAdd?: () => void;
        addButtonLabel?: string;
        renderActions?: (item: T) => ReactNode;
        searchPlaceholder?: string;
        emptyMessage?: string;
    }

    const DataTable: <T extends { id?: string | number }>(props: DataTableProps<T>) => JSX.Element;
    export default DataTable;
}

declare module 'core_frontend/Theme' {
    import type { Theme } from '@mui/material/styles';
    const theme: Theme;
    export default theme;
}

declare module 'core_frontend/CoreCss' {
    const css: string;
    export default css;
}
