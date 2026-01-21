import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import 'core_frontend/CoreCss';
import Layout from './components/Layout';
import POS from './pages/POS';
import Products from './pages/Products';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<POS />} />
            <Route path="pos" element={<POS />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
