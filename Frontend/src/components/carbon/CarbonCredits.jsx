import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Chip,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Container,
} from '@mui/material';
import {
  Nature,
  TrendingUp,
  Verified,
  SwapHoriz,
  CheckCircle,
  Info,
  AccountBalance,
} from '@mui/icons-material';

const CarbonCredits = () => {
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [carbonBalance, setCarbonBalance] = useState(150);
  const [marketPrice] = useState(25.50);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Earned',
      amount: 50,
      price: '$23.00',
      date: '2024-06-15',
      status: 'Verified',
      description: 'Sustainable farming practices',
    },
    {
      id: 2,
      type: 'Sold',
      amount: 25,
      price: '$24.50',
      date: '2024-06-10',
      status: 'Completed',
      description: 'Marketplace trade',
    },
    {
      id: 3,
      type: 'Earned',
      amount: 30,
      price: '$22.80',
      date: '2024-06-05',
      status: 'Verified',
      description: 'Cover crop implementation',
    },
  ]);

  const [verificationData] = useState({
    totalEarned: 180,
    totalSold: 30,
    pendingVerification: 15,
    verificationRate: 95,
  });

  const handleTrade = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        type: tradeType === 'buy' ? 'Bought' : 'Sold',
        amount: parseInt(tradeAmount),
        price: `$${marketPrice.toFixed(2)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        description: 'Marketplace trade',
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      if (tradeType === 'buy') {
        setCarbonBalance(carbonBalance + parseInt(tradeAmount));
      } else {
        setCarbonBalance(carbonBalance - parseInt(tradeAmount));
      }
      
      setTradeAmount('');
      setLoading(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'earned':
        return <Nature sx={{ color: '#059669' }} />;
      case 'sold':
      case 'bought':
        return <SwapHoriz sx={{ color: '#1a365d' }} />;
      default:
        return <TrendingUp sx={{ color: '#1a365d' }} />;
    }
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
            🌱 Carbon Credits Trading
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              maxWidth: 600,
            }}
          >
            Earn, verify, and trade tokenized carbon credits for sustainable farming practices
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 4,
          mb: 6,
        }}>
          {/* Portfolio Overview */}
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
                Your Carbon Portfolio
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#1a365d', mx: 'auto', mb: 2 }}>
                  <Nature sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1a365d',
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  {carbonBalance}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Carbon Credits
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#059669', 
                    mt: 1,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  ${(carbonBalance * marketPrice).toFixed(2)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Portfolio Value
                </Typography>
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#059669',
                      fontFamily: '"Manrope", "Inter", sans-serif',
                    }}
                  >
                    {verificationData.totalEarned}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4a5568',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Total Earned
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a365d',
                      fontFamily: '"Manrope", "Inter", sans-serif',
                    }}
                  >
                    {verificationData.totalSold}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4a5568',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Total Sold
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Trading Interface */}
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
                Trade Carbon Credits
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography 
                  variant="body2"
                  sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                >
                  Current Market Price: ${marketPrice.toFixed(2)} per credit | 
                  24h Change: +2.3%
                </Typography>
              </Alert>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                mb: 3,
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={tradeType === 'buy' ? 'contained' : 'outlined'}
                    onClick={() => setTradeType('buy')}
                    sx={{ 
                      flex: 1,
                      bgcolor: tradeType === 'buy' ? '#1a365d' : 'transparent',
                      '&:hover': {
                        bgcolor: tradeType === 'buy' ? '#2d3748' : '#f7fafc',
                      }
                    }}
                  >
                    Buy Credits
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'contained' : 'outlined'}
                    onClick={() => setTradeType('sell')}
                    sx={{ 
                      flex: 1,
                      bgcolor: tradeType === 'sell' ? '#1a365d' : 'transparent',
                      '&:hover': {
                        bgcolor: tradeType === 'sell' ? '#2d3748' : '#f7fafc',
                      }
                    }}
                  >
                    Sell Credits
                  </Button>
                </Box>
                
                <TextField
                  fullWidth
                  label="Amount (Credits)"
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                />
              </Box>

              {tradeAmount && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography 
                    variant="body2"
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                  >
                    {tradeType === 'buy' ? 'Total Cost' : 'Total Revenue'}: 
                    ${(parseFloat(tradeAmount) * marketPrice).toFixed(2)}
                  </Typography>
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleTrade}
                disabled={!tradeAmount || loading}
                sx={{ 
                  py: 2,
                  bgcolor: '#1a365d',
                  '&:hover': { bgcolor: '#2d3748' }
                }}
              >
                {loading ? 'Processing Trade...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Carbon Credits`}
              </Button>

              {loading && <LinearProgress sx={{ mt: 2 }} />}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
          mb: 6,
        }}>
          {/* Verification Status */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 3,
                }}
              >
                <Verified sx={{ mr: 1, color: '#1a365d' }} />
                Verification Status
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
                  Chainlink Proof of Reserves verified
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
                  Satellite imagery confirmation
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
                  Third-party audit completed
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
                  ERC-20 tokens minted
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="body2"
                  sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                >
                  Verification Rate
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#059669',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {verificationData.verificationRate}%
                </Typography>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={verificationData.verificationRate} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#059669',
                    borderRadius: 4,
                  },
                }}
              />

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography 
                  variant="body2"
                  sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                >
                  {verificationData.pendingVerification} credits pending verification
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Earning Opportunities */}
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
                Earning Opportunities
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  🌱 Cover Crop Implementation
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Earn 2-5 credits per acre annually
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  🚜 No-Till Farming
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Earn 1-3 credits per acre annually
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  💧 Water Conservation
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568', 
                    mb: 2,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Earn 0.5-2 credits per acre annually
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  🌾 Crop Rotation
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Earn 1-4 credits per acre annually
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#e2e8f0',
                  color: '#1a365d',
                  '&:hover': {
                    borderColor: '#1a365d',
                    bgcolor: '#f7fafc',
                  },
                }}
              >
                Learn More About Earning Credits
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Transaction History */}
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
              Transaction History
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Description</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#1a365d' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1a365d' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: '#f7fafc',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getTypeIcon(transaction.type)}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              ml: 1, 
                              fontWeight: 500,
                              fontFamily: '"Inter", "Roboto", sans-serif',
                            }}
                          >
                            {transaction.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          }}
                        >
                          {transaction.amount} Credits
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                        >
                          {transaction.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                        >
                          {transaction.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={transaction.status}
                          color={getStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4a5568',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          }}
                        >
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CarbonCredits;