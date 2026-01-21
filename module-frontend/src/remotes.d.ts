declare module 'core_frontend/DataTable' {
    import { ReactNode, ComponentType } from 'react';

    export interface Column<T> {
        id: keyof T | string;
        label: string;
        render?: (item: T) => ReactNode;
        align?: 'left' | 'center' | 'right';
    }

    interface DataTableProps<T> {
        title?: string;
        columns: Column<T>[];
        data: T[];
        onAdd?: () => void;
        addButtonLabel?: string;
        renderActions?: (item: T) => ReactNode;
        emptyMessage?: string;
    }

    const DataTable: ComponentType<DataTableProps<any>>;
    export default DataTable;
}

declare module 'core_frontend/Theme';
declare module 'core_frontend/UI';
