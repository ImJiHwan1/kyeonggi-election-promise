import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import Layout from './components/Layout';
import MemberDetailModal from './components/MemberDetailModal';

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    primary: {
      main: '#001529',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
            <MemberDetailModal />
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
