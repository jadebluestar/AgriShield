// src/App.jsx
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, CircularProgress } from '@mui/material';

import { config } from './config/wagmi';
import { AppProvider } from './context/AppContext'; // ✅ uses your AppProvider

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Insurance from './pages/Insurance';
import CarbonCredits from './pages/CarbonCredits';
import Profile from './pages/Profile';
import Registration from './pages/Registration';

console.log("App.jsx is loading");

// ✅ Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary" textAlign="center">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Check the console for more details
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

// ✅ Loading fallback
const LoadingFallback = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
    <Typography variant="h6" mt={2}>
      Loading...
    </Typography>
  </Box>
);

// ✅ React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ✅ Theme (can keep simple or full)
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  },
});

function App() {
  useEffect(() => {
    console.log("App component mounted successfully");
  }, []);

  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppProvider> {/* ✅ wrap with your AppProvider */}
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    minHeight="100vh"
                    bgcolor="#fafafa"
                  >
                    <Header />
                    <main style={{ flex: 1 }}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/insurance" element={<Insurance />} />
                        <Route path="/carbon" element={<CarbonCredits />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/register" element={<Registration />} />
                      </Routes>
                    </main>
                    <Footer />
                  </Box>
                </Suspense>
              </Router>
            </AppProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;