import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  Slider,
  Container,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  SwapHoriz,
  CheckCircle,
  Info,
  Warning,
  Security,
  Speed,
  Verified,
} from '@mui/icons-material';

const LendingInterface = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(12);
  const [collateral, setCollateral] = useState('');
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [targetChain, setTargetChain] = useState('avalanche');
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanPurpose, setLoanPurpose] = useState('');

  const [activeLoans, setActiveLoans] = useState([
    {
      id: 1,
      amount: '$5,000',
      term: '12 months',
      rate: '8.5%',
      remaining: '$3,200',
      status: 'Active',
      chain: 'Avalanche',
      nextPayment: '2024-07-15',
      monthlyPayment: '$450',
    },
    {
      id: 2,
      amount: '$2,500',
      term: '6 months',
      rate: '7.2%',
      remaining: '$800',
      status: 'Active',
      chain: 'Ethereum',
      nextPayment: '2024-07-20',
      monthlyPayment: '$425',
    },
  ]);

  const chains = [
    { value: 'ethereum', label: 'Ethereum', symbol: 'ETH', fee: '0.05 ETH' },
    { value: 'avalanche', label: 'Avalanche', symbol: 'AVAX', fee: '2 AVAX' },
    { value: 'polygon', label: 'Polygon', symbol: 'MATIC', fee: '50 MATIC' },
    { value: 'arbitrum', label: 'Arbitrum', symbol: 'ARB', fee: '0.01 ETH' },
  ];

  const loanPurposes = [
    'Seed Purchase',
    'Equipment Financing',
    'Land Improvement',
    'Seasonal Operations',
    'Emergency Funding',
    'Expansion Projects',
  ];

  const calculateMonthlyPayment = () => {
    if (!loanAmount) return 0;
    const principal = parseFloat(loanAmount);
    const monthlyRate = interestRate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return payment.toFixed(2);
  };

  const calculateTotalInterest = () => {
    if (!loanAmount) return 0;
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const totalPayments = monthlyPayment * loanTerm;
    const totalInterest = totalPayments - parseFloat(loanAmount);
    return totalInterest.toFixed(2);
  };

  const getCollateralRatio = () => {
    if (!loanAmount || !collateral) return 0;
    return ((parseFloat(collateral) / parseFloat(loanAmount)) * 100).toFixed(1);
  };

  const isFormValid = () => {
    return loanAmount && 
           collateral && 
           loanPurpose && 
           parseFloat(collateral) >= parseFloat(loanAmount) * 1.2; // 120% collateral ratio minimum
  };

  const handleApplyLoan = async () => {
    if (!isFormValid()) {
      alert('Please fill all fields and ensure collateral is at least 120% of loan amount');
      return;
    }

    setLoading(true);
    
    // Simulate loan application process
    setTimeout(() => {
      const newLoan = {
        id: activeLoans.length + 1,
        amount: `$${loanAmount}`,
        term: `${loanTerm} months`,
        rate: `${interestRate}%`,
        remaining: `$${loanAmount}`,
        status: 'Pending Approval',
        chain: chains.find(c => c.value === targetChain)?.label || '',
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyPayment: `$${calculateMonthlyPayment()}`,
      };
      
      setActiveLoans([newLoan, ...activeLoans]);
      
      // Reset form
      setLoanAmount('');
      setCollateral('');
      setLoanPurpose('');
      setLoading(false);
      
      alert('Loan application submitted successfully! You will receive confirmation shortly.');
    }, 3000);
  };

  const handleLoanPayment = (loanId) => {
    setActiveLoans(prevLoans => 
      prevLoans.map(loan => 
        loan.id === loanId 
          ? { ...loan, status: 'Payment Processing' }
          : loan
      )
    );
    alert('Payment initiated successfully!');
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      overflowX: 'hidden', 
      bgcolor: '#fafafa', 
      minHeight: '100vh',
      m: 0,
      p: 0,
    }}>
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          width: '100vw', 
          px: { xs: 3, md: 4 }, 
          py: 4,
          m: 0,
        }}
      >
        {/* Header Section */}
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
            💰 Cross-Chain Lending
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            Access microloans across multiple blockchain networks with competitive rates, 
            instant approval, and flexible repayment terms powered by Chainlink CCIP
          </Typography>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 6 
        }}>
          <Chip 
            icon={<Security />} 
            label="Secured by Smart Contracts" 
            sx={{ 
              bgcolor: '#e6fffa',
              color: '#1a365d',
              border: '1px solid #b2f5ea',
              fontWeight: 600,
            }} 
          />
          <Chip 
            icon={<Speed />} 
            label="Instant Cross-Chain Transfer" 
            sx={{ 
              bgcolor: '#f0f9ff',
              color: '#1a365d',
              border: '1px solid #bfdbfe',
              fontWeight: 600,
            }} 
          />
          <Chip 
            icon={<Verified />} 
            label="Transparent Rates" 
            sx={{ 
              bgcolor: '#fefcbf',
              color: '#1a365d',
              border: '1px solid #fef08a',
              fontWeight: 600,
            }} 
          />
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 4,
          mb: 6,
        }}>
          {/* Loan Application Form */}
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
                Apply for Cross-Chain Loan
              </Typography>
              
              {/* Loan Amount and Purpose */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                mb: 3,
              }}>
                <TextField
                  fullWidth
                  label="Loan Amount ($)"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  inputProps={{ min: 100, max: 50000 }}
                  helperText="Minimum: $100, Maximum: $50,000"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Loan Purpose</InputLabel>
                  <Select
                    value={loanPurpose}
                    label="Loan Purpose"
                    onChange={(e) => setLoanPurpose(e.target.value)}
                  >
                    {loanPurposes.map((purpose) => (
                      <MenuItem key={purpose} value={purpose}>
                        {purpose}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Collateral */}
              <TextField
                fullWidth
                label="Collateral Value ($)"
                type="number"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                sx={{ mb: 3 }}
                helperText="Minimum 120% of loan amount required"
                error={collateral && parseFloat(collateral) < parseFloat(loanAmount || 0) * 1.2}
              />

              {/* Chain Selection */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                mb: 3,
              }}>
                <FormControl fullWidth>
                  <InputLabel>Source Chain</InputLabel>
                  <Select
                    value={sourceChain}
                    label="Source Chain"
                    onChange={(e) => setSourceChain(e.target.value)}
                  >
                    {chains.map((chain) => (
                      <MenuItem key={chain.value} value={chain.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <span>{chain.label} ({chain.symbol})</span>
                          <Chip label={`Fee: ${chain.fee}`} size="small" />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Target Chain</InputLabel>
                  <Select
                    value={targetChain}
                    label="Target Chain"
                    onChange={(e) => setTargetChain(e.target.value)}
                  >
                    {chains.map((chain) => (
                      <MenuItem key={chain.value} value={chain.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <span>{chain.label} ({chain.symbol})</span>
                          <Chip label={`Fee: ${chain.fee}`} size="small" />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Loan Term Slider */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Loan Term: {loanTerm} months
                </Typography>
                <Slider
                  value={loanTerm}
                  onChange={(e, newValue) => setLoanTerm(newValue)}
                  min={3}
                  max={36}
                  step={3}
                  marks={[
                    { value: 3, label: '3m' },
                    { value: 12, label: '1y' },
                    { value: 24, label: '2y' },
                    { value: 36, label: '3y' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              {/* Loan Summary */}
              {loanAmount && collateral && (
                <Alert 
                  severity={getCollateralRatio() >= 120 ? "info" : "warning"} 
                  sx={{ mb: 3 }}
                >
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        mb: 1,
                      }}
                    >
                      Loan Summary:
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                    >
                      Monthly Payment: ${calculateMonthlyPayment()} | 
                      Total Interest: ${calculateTotalInterest()}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                    >
                      Interest Rate: {interestRate}% APR | 
                      Collateral Ratio: {getCollateralRatio()}%
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* Cross-Chain Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#f7fafc', borderRadius: 2 }}>
                <SwapHoriz sx={{ mr: 2, color: '#1a365d' }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Cross-Chain Transfer via Chainlink CCIP
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: '#4a5568',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Funds will be transferred from {chains.find(c => c.value === sourceChain)?.label} to {chains.find(c => c.value === targetChain)?.label}
                  </Typography>
                </Box>
              </Box>

              {/* Apply Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleApplyLoan}
                disabled={!isFormValid() || loading}
                sx={{ 
                  py: 2,
                  bgcolor: '#1a365d',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#2d3748' },
                  '&:disabled': { 
                    bgcolor: '#e2e8f0',
                    color: '#4a5568',
                  },
                }}
              >
                {loading ? 'Processing Application...' : 'Apply for Loan'}
              </Button>

              {loading && <LinearProgress sx={{ mt: 2 }} />}
            </CardContent>
          </Card>

          {/* Loan Benefits & Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Benefits Card */}
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
                  Lending Benefits
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
                    Competitive rates starting at 7.2% APR
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
                    Cross-chain flexibility via Chainlink CCIP
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
                    Instant approval for qualified applicants
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
                    Automated repayment tracking
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

                <Alert severity="info">
                  <Typography 
                    variant="body2"
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                  >
                    <Info sx={{ mr: 1, fontSize: 16 }} />
                    All loans are secured by collateral and processed through audited smart contracts for maximum security.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Interest Rate Card */}
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
                  Current Rates
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#059669',
                      fontFamily: '"Manrope", "Inter", sans-serif',
                    }}
                  >
                    {interestRate}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4a5568',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Annual Percentage Rate
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    3-6 months:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    7.2% APR
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    6-12 months:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    8.5% APR
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    12+ months:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                    9.8% APR
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Active Loans Section */}
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
              Your Active Loans
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
              gap: 3,
            }}>
              {activeLoans.map((loan) => (
                <Card key={loan.id} variant="outlined" sx={{ border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontFamily: '"Manrope", "Inter", sans-serif',
                        }}
                      >
                        {loan.amount}
                      </Typography>
                      <Chip
                        label={loan.status}
                        color={
                          loan.status === 'Active' ? 'success' : 
                          loan.status === 'Pending Approval' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568', 
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Term:</strong> {loan.term}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568', 
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Rate:</strong> {loan.rate}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568', 
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Remaining:</strong> {loan.remaining}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568', 
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Network:</strong> {loan.chain}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568', 
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Next Payment:</strong> {new Date(loan.nextPayment).toLocaleDateString()}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4a5568',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        <strong>Monthly:</strong> {loan.monthlyPayment}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleLoanPayment(loan.id)}
                        disabled={loan.status !== 'Active'}
                        sx={{ 
                          flex: 1,
                          bgcolor: '#1a365d',
                          '&:hover': { bgcolor: '#2d3748' },
                          '&:disabled': { 
                            bgcolor: '#e2e8f0',
                            color: '#4a5568',
                          },
                        }}
                      >
                        Make Payment
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: '#e2e8f0',
                          color: '#1a365d',
                          '&:hover': {
                            borderColor: '#1a365d',
                            bgcolor: '#f7fafc',
                          },
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {activeLoans.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AccountBalance sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Manrope", "Inter", sans-serif',
                    mb: 1,
                  }}
                >
                  No Active Loans
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Apply for your first loan above to get started with AgriChain lending.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LendingInterface;
