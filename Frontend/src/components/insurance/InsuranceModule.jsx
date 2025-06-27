import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  LinearProgress,
  Container,
} from '@mui/material';
import {
  Security,
  CloudQueue,
  WbSunny,
  Grain,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const InsuranceModule = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [coverage, setCoverage] = useState('');
  const [premium, setPremium] = useState(0);
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([
    {
      id: 1,
      type: 'Drought Protection',
      coverage: '$5,000',
      premium: '$150/month',
      status: 'Active',
      trigger: 'No rain for 14 days',
    },
    {
      id: 2,
      type: 'Flood Insurance',
      coverage: '$3,000',
      premium: '$100/month',
      status: 'Active',
      trigger: 'Rainfall > 100mm/day',
    },
  ]);

  const policyTypes = [
    { value: 'drought', label: 'Drought Protection', icon: <WbSunny />, premium: 150 },
    { value: 'flood', label: 'Flood Insurance', icon: <Grain />, premium: 100 },
    { value: 'hail', label: 'Hail Damage', icon: <CloudQueue />, premium: 120 },
    { value: 'frost', label: 'Frost Protection', icon: <Security />, premium: 80 },
  ];

  const handlePolicySelect = (policyType) => {
    setSelectedPolicy(policyType);
    const policy = policyTypes.find(p => p.value === policyType);
    setPremium(policy ? policy.premium : 0);
  };

  const handleCreatePolicy = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const newPolicy = {
        id: policies.length + 1,
        type: policyTypes.find(p => p.value === selectedPolicy)?.label || '',
        coverage: `$${coverage}`,
        premium: `$${premium}/month`,
        status: 'Pending',
        trigger: 'Weather conditions monitored',
      };
      
      setPolicies([...policies, newPolicy]);
      setSelectedPolicy('');
      setCoverage('');
      setPremium(0);
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth={false} disableGutters sx={{ width: '100vw', px: { xs: 3, md: 4 }, py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: '#1a365d',
              fontFamily: '"Manrope", "Inter", sans-serif',
              mb: 2,
            }}
          >
            🛡️ Weather Insurance
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              maxWidth: 600,
            }}
          >
            Protect your crops with automated weather-triggered insurance policies powered by Chainlink oracles
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
          mb: 6,
        }}>
          {/* Create New Policy */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 3,
                }}
              >
                Create New Policy
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={selectedPolicy}
                  label="Policy Type"
                  onChange={(e) => handlePolicySelect(e.target.value)}
                >
                  {policyTypes.map((policy) => (
                    <MenuItem key={policy.value} value={policy.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {policy.icon}
                        <Typography sx={{ ml: 1 }}>{policy.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Coverage Amount ($)"
                type="number"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                sx={{ mb: 3 }}
              />

              {selectedPolicy && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Monthly Premium: ${premium} | 
                  Automatic payout when weather conditions are met
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleCreatePolicy}
                disabled={!selectedPolicy || !coverage || loading}
                sx={{ 
                  py: 2,
                  bgcolor: '#1a365d',
                  '&:hover': { bgcolor: '#2d3748' }
                }}
              >
                {loading ? 'Creating Policy...' : 'Create Insurance Policy'}
              </Button>

              {loading && <LinearProgress sx={{ mt: 2 }} />}
            </CardContent>
          </Card>

          {/* Policy Benefits */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 3,
                }}
              >
                Policy Benefits
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <CheckCircle sx={{ mr: 1, color: '#059669', fontSize: 20 }} />
                  Automated payouts via smart contracts
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <CheckCircle sx={{ mr: 1, color: '#059669', fontSize: 20 }} />
                  Real-time weather data from AccuWeather
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <CheckCircle sx={{ mr: 1, color: '#059669', fontSize: 20 }} />
                  No claim filing required
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <CheckCircle sx={{ mr: 1, color: '#059669', fontSize: 20 }} />
                  Transparent blockchain verification
                </Typography>
              </Box>

              <Alert severity="warning">
                <Typography 
                  variant="body2"
                  sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                >
                  <Warning sx={{ mr: 1, fontSize: 16 }} />
                  Weather conditions are monitored 24/7. Payouts are triggered automatically 
                  when predefined thresholds are met.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Box>

        {/* Active Policies */}
        <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Manrope", "Inter", sans-serif',
                mb: 3,
              }}
            >
              Your Active Policies
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}>
              {policies.map((policy) => (
                <Card key={policy.id} variant="outlined" sx={{ border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontFamily: '"Manrope", "Inter", sans-serif',
                        }}
                      >
                        {policy.type}
                      </Typography>
                      <Chip
                        label={policy.status}
                        color={policy.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4a5568', 
                        mb: 1,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      Coverage: {policy.coverage}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4a5568', 
                        mb: 1,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      Premium: {policy.premium}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4a5568',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      Trigger: {policy.trigger}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        mt: 2,
                        borderColor: '#e2e8f0',
                        color: '#1a365d',
                        '&:hover': {
                          borderColor: '#1a365d',
                          bgcolor: '#f7fafc',
                        },
                      }}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {policies.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  No active policies. Create your first weather insurance policy above.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default InsuranceModule;
