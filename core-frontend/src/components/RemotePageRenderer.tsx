import { useEffect, useState, type ComponentType } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { loadRemote } from '@module-federation/runtime';
import { init } from '@module-federation/runtime';
import { useModules } from '../contexts/ModuleContext';
import NotFound from '../pages/NotFound';

// Ensure runtime is initialized (singleton pattern)
// We might need to register the remotes dynamically if they aren't in build config
// But the user's snippet uses direct loadRemote with properties that look like it registers on fly.

interface ModuleConfig {
    remoteEntry: string;
    scope: string;
    exposedModule: string; // User used 'module' in example, keeping consistent with DB 'exposedModule'
}

// We need to keep track of initialized scopes to avoid re-initializing
const initializedScopes = new Set<string>();

const loadRemotePage = async (config: ModuleConfig) => {
    // Dynamic remote registration
    if (!initializedScopes.has(config.scope)) {
        init({
            name: 'core_frontend',
            remotes: [
                {
                    name: config.scope,
                    entry: config.remoteEntry,
                    type: 'module',
                }
            ]
        });
        initializedScopes.add(config.scope);
    }

    // Load the module
    // Load the module
    // Ensure we don't end up with double dots like module_frontend/./Module
    const cleanModulePath = config.exposedModule.replace(/^\.\//, '');
    const moduleId = `${config.scope}/${cleanModulePath}`;

    try {
        const module = await loadRemote(moduleId);
        // @ts-ignore
        return module.default || module;
    } catch (err) {
        console.error(`Failed to loadRemote ${moduleId}:`, err);
        throw err;
    }
};

interface Props {
    config: ModuleConfig;
}

const RemotePageRenderer = ({ config }: Props) => {
    const { modules } = useModules();
    const [Component, setComponent] = useState<ComponentType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isAllowed = modules.some(m => m.scope === config.scope && m.exposedModule === config.exposedModule);

    useEffect(() => {
        if (!isAllowed) {
            setError('Você não tem permissão para acessar este módulo.');
            return;
        }

        let mounted = true;
        setComponent(null);
        setError(null);

        loadRemotePage(config)
            .then((Comp) => {
                if (mounted) setComponent(() => Comp);
            })
            .catch((err) => {
                console.error("Failed to load remote page:", err);
                if (mounted) setError(`Failed to load module: ${config.scope}`);
            });

        return () => {
            mounted = false;
        };
    }, [config.remoteEntry, config.scope, config.exposedModule]);

    if (error && error.includes('permissão')) {
        return <NotFound />;
    }

    if (error) {
        return (
            <Box sx={{ p: 3, color: 'error.main' }}>
                <Typography variant="h6">Error</Typography>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    if (!Component) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return <Component />;
};

export default RemotePageRenderer;
