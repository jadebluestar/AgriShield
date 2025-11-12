import React, { useState, useEffect } from 'react';
import { useInsurance } from '../../hooks/useInsurance';
import { fetchCurrentWeather } from '../../services/weatherService';
import { Card, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Alert, Container, Grid, CircularProgress } from '@mui/material';
import { Security, CloudQueue, WbSunny, Add, Cancel, CheckCircle } from '@mui/icons-material';

const InsuranceModule = () => {
  const [location, setLocation] = useState('New York');
  const [coverage, setCoverage] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  const { policies, createPolicy, cancelPolicy, loading, error, fetchPolicies, isConnected } = useInsurance();

  useEffect(() => {
    if (isConnected) fetchPolicies();
  }, [isConnected, fetchPolicies]);

  useEffect(() => {
    const loadWeather = async () => {
      if (!location) return;
      setWeatherLoading(true);
      try {
        const weather = await fetchCurrentWeather(location);
        setWeatherData(weather);
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setWeatherLoading(false);
      }
    };
    loadWeather();
  }, [location]);

  const policyTypes = [
    { value: 'drought', label: 'Drought Protection', icon: <WbSunny /> },
    { value: 'flood', label: 'Flood Insurance', icon: <CloudQueue /> },
    { value: 'hail', label: 'Hail Damage', icon: <Security /> },
  ];

  const handleCreate = async () => {
    if (!coverage || !location || !policyType) return alert('Please fill all fields');
    await createPolicy(location, coverage);
    setCoverage('');
    setPolicyType('');
  };

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ textAlign: 'center', p: 6 }}>
          <Security sx={{ fontSize: 80, color: '#1a365d', mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Connect Wallet Required</Typography>
          <Typography color="text.secondary">Please connect your wallet to access insurance services</Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a365d', mb: 1 }}>
         Weather Insurance
      </Typography>
      <Typography variant="h6" sx={{ color: '#4a5568', mb: 4 }}>
        Protect your crops with blockchain-powered weather insurance
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2" color="text.secondary">Active Policies</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>
              {policies.filter(p => p.active).length}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2" color="text.secondary">Total Policies</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>
              {policies.length}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2" color="text.secondary">Weather</Typography>
            {weatherData && (
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>
                {weatherData.temperature}C
              </Typography>
            )}
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2" color="text.secondary">Location</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
              {location}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
                Create New Policy
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Policy Type</InputLabel>
                <Select value={policyType} label="Policy Type" onChange={(e) => setPolicyType(e.target.value)}>
                  {policyTypes.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {p.icon}
                        <Typography sx={{ ml: 1 }}>{p.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField 
                fullWidth 
                label="Location (City)" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                sx={{ mb: 3 }}
              />

              <TextField 
                fullWidth 
                label="Coverage (ETH)" 
                type="number" 
                value={coverage} 
                onChange={(e) => setCoverage(e.target.value)} 
                sx={{ mb: 3 }}
                inputProps={{ min: 0.01, step: 0.01 }}
              />

              {coverage && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Premium: {(parseFloat(coverage || 0) * 0.05).toFixed(4)} ETH (5% of coverage)
                </Alert>
              )}

              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleCreate} 
                disabled={!policyType || !coverage || loading}
                sx={{ py: 2, bgcolor: '#1a365d', '&:hover': { bgcolor: '#2d3748' } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Policy'}
              </Button>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                <CloudQueue sx={{ mr: 1, verticalAlign: 'middle' }} />
                Current Weather
              </Typography>
              
              {weatherLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : weatherData ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Temperature</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{weatherData.temperature}C</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Condition</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{weatherData.condition}</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Humidity</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{weatherData.humidity}%</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Wind</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{weatherData.windSpeed} km/h</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Rain</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{weatherData.precipitation} mm</Typography>
                    </Card>
                  </Grid>
                </Grid>
              ) : <Alert severity="info">Loading weather data...</Alert>}

              {weatherData?.isMock && (
                <Alert severity="warning" sx={{ mt: 2 }}>Using mock weather data. Add API key for real data.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Your Policies ({policies.length})
          </Typography>

          {policies.length > 0 ? (
            <Grid container spacing={3}>
              {policies.map((p, idx) => {
                const isActive = p.active;
                const policyId = p.id?.toString() || idx;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={policyId}>
                    <Card variant="outlined" sx={{ 
                      border: '2px solid', 
                      borderColor: isActive ? '#059669' : '#e2e8f0',
                      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Policy #{policyId}
                          </Typography>
                          <Chip 
                            label={isActive ? 'Active' : 'Cancelled'} 
                            color={isActive ? 'success' : 'default'} 
                            size='small'
                            icon={isActive ? <CheckCircle /> : <Cancel />}
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Location:</strong> {p.location}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Coverage:</strong> {p.coverageAmount ? (Number(p.coverageAmount) / 1e18).toFixed(4) : '0'} ETH
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Premium:</strong> {p.premiumPaid ? (Number(p.premiumPaid) / 1e18).toFixed(4) : '0'} ETH
                        </Typography>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => isActive && cancelPolicy(Number(p.id))}
                          disabled={!isActive || loading}
                          startIcon={<Cancel />}
                        >
                          {isActive ? 'Cancel Policy' : 'Cancelled'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f7fafc', borderRadius: 2 }}>
              <Security sx={{ fontSize: 64, color: '#cbd5e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No policies yet</Typography>
              <Typography variant="body2" color="text.secondary">Create your first policy above</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default InsuranceModule;
