import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../api/api';


export interface ModuleDefinition {
    id: string;
    name: string;
    route: string;
    menuLabel: string;
    menuGroup?: string;
    icon?: string;
    remoteEntry: string;
    scope: string;
    exposedModule: string;
    enabled: boolean;
}

interface ModuleContextType {
    modules: ModuleDefinition[];
    loading: boolean;
    refreshModules: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType>({
    modules: [],
    loading: false,
    refreshModules: async () => { },
});

export const useModules = () => useContext(ModuleContext);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
    const [modules, setModules] = useState<ModuleDefinition[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchModules = async () => {
        try {
            setLoading(true);

            // Get user's modules from localStorage
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (!userStr || !token) {
                setModules([]);
                setLoading(false);
                return;
            }

            const res = await api.get('/modules/mine');
            const userModules = res.data || [];

            if (userModules.length === 0) {
                setModules([]);
                setLoading(false);
                return;
            }

            // Load metadata from each unique remote
            const remoteMetadataMap: Record<string, any> = {};
            const uniqueRemotes = [...new Set(userModules.map((m: ModuleDefinition) => m.scope))];

            for (const scope of uniqueRemotes) {
                try {
                    const { loadRemote } = await import('@module-federation/runtime');
                    const metadata = await loadRemote(`${scope}/./moduleMetadata`) as any;
                    // @ts-ignore
                    remoteMetadataMap[scope] = metadata?.default || metadata?.moduleMetadata || metadata || {};
                } catch (error) {
                    console.warn(`Failed to load metadata from ${scope}:`, error);
                }
            }

            // Merge icon data from metadata
            const enhancedModules = userModules.map((mod: ModuleDefinition) => {
                const metadata = remoteMetadataMap[mod.scope];
                if (metadata && metadata[mod.exposedModule]) {
                    return {
                        ...mod,
                        icon: metadata[mod.exposedModule].icon || mod.icon
                    };
                }
                return mod;
            });

            setModules(enhancedModules);
        } catch (error) {
            console.error('Failed to fetch modules', error);
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return (
        <ModuleContext.Provider value={{ modules, loading, refreshModules: fetchModules }}>
            {children}
        </ModuleContext.Provider>
    );
};
