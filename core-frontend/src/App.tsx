import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Receivables from './pages/Receivables';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { ModuleProvider, useModules } from './contexts/ModuleContext';
import RemotePageRenderer from './components/RemotePageRenderer';

function AppRoutes() {
  const { modules, loading } = useModules();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="receivables" element={<Receivables />} />
        <Route path="users" element={<Users />} />

        {modules.map((module) => (
          <Route
            key={module.id}
            path={module.route}
            element={<RemotePageRenderer config={module} />}
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ModuleProvider>
          <AppRoutes />
        </ModuleProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
