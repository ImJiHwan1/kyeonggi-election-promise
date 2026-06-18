import { isMobile, isTablet } from 'react-device-detect';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MobileCityMemberListPage from '@pages/mobile/MobileCityMemberListPage.tsx';
import MobileDetailPage from '@pages/mobile/MobileDetailPage.tsx';
import MobileMainPage from '@pages/mobile/MobileMainPage.tsx';
import MobileMemberPledgePage from '@pages/mobile/MobileMemberPledgePage.tsx';
import MobileSearchPage from '@pages/mobile/MobileSearchPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import DetailPage from './pages/DetailPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';

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
      default: '#fff',
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
  const [searchParams] = useSearchParams();
  const deviceType = searchParams.get('deviceType');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {deviceType === 'mobile' || isMobile || isTablet ? (
          <Routes>
            <Route path="/" element={<MobileMainPage />} />
            <Route path="/detail" element={<MobileDetailPage />} />
            <Route path="/city/member/:cityName" element={<MobileCityMemberListPage />} />
            <Route path="/member/:memberId/pledges" element={<MobileMemberPledgePage />} />
            <Route path="/search" element={<MobileSearchPage />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </Layout>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
