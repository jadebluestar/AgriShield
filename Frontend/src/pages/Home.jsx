import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Chip,
  Avatar,
  Rating,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Security,
  AccountBalance,
  Nature,
  TrendingUp,
  ArrowForward,
  CheckCircle,
  Groups,
  Public,
  Verified,
  Star,
  Shield,
  Speed,
  CloudQueue,
  Analytics,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isVisible, setIsVisible] = useState(false);
  const { connected } = useWeb3();
  const { isRegistered } = useAppContext();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Security sx={{ fontSize: 48, color: '#1a365d' }} />,
      title: 'Weather-Triggered Insurance',
      description: 'Automatic payouts for droughts/floods via Chainlink oracles and AccuWeather API integration',
      benefits: ['24/7 monitoring', 'Instant payouts', 'No paperwork'],
      accent: '#e6fffa',
    },
    {
      icon: <AccountBalance sx={{ fontSize: 48, color: '#1a365d' }} />,
      title: 'Cross-Chain Microloans',
      description: 'Lenders on Ethereum fund loans on Avalanche via CCIP with automated repayments',
      benefits: ['Low interest rates', 'Cross-chain flexibility', 'Automated tracking'],
      accent: '#f0f9ff',
    },
    {
      icon: <Nature sx={{ fontSize: 48, color: '#1a365d' }} />,
      title: 'Crop Carbon Credit Tokenization',
      description: 'NFTs for harvests, Proof of Reserves for carbon credits with DeFi trading',
      benefits: ['Sustainable farming rewards', 'Verified credits', 'DeFi integration'],
      accent: '#f0fff4',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#1a365d' }} />,
      title: 'Real-Time Data Feeds',
      description: 'Get real-time crop prices, carbon credit rates via Chainlink Data Feeds',
      benefits: ['Market insights', 'Price tracking', 'Data-driven decisions'],
      accent: '#fefcbf',
    },
  ];

  const stats = [
    { label: 'Active Farmers', value: '25,000+', icon: <Groups />, trend: '+127%' },
    { label: 'Countries Served', value: '45+', icon: <Public />, trend: '+67%' },
    { label: 'Total Loans Issued', value: '$50M+', icon: <AccountBalance />, trend: '+200%' },
    { label: 'Carbon Credits Traded', value: '1M+', icon: <Nature />, trend: '+400%' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab, India',
      quote: 'Weather-triggered insurance saved my wheat crop during unexpected drought. Automatic payout in 24 hours!',
      rating: 5,
      avatar: '👨‍🌾',
      cropType: 'Wheat Farmer',
    },
    {
      name: 'Maria Santos',
      location: 'São Paulo, Brazil',
      quote: 'Cross-chain lending from Ethereum to Avalanche gave me instant access to funds for coffee expansion.',
      rating: 5,
      avatar: '👩‍🌾',
      cropType: 'Coffee Grower',
    },
    {
      name: 'James Wilson',
      location: 'Iowa, USA',
      quote: 'Carbon credit tokenization turned my sustainable farming practices into a profitable income stream.',
      rating: 5,
      avatar: '🧑‍🌾',
      cropType: 'Corn & Soybean',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Register & Mint NFT',
      description: 'Complete KYC and mint your Farmer NFT on Avalanche with IPFS metadata',
      icon: <Shield />,
    },
    {
      step: 2,
      title: 'Connect Services',
      description: 'Link weather monitoring, loan pools, and carbon credit verification',
      icon: <CloudQueue />,
    },
    {
      step: 3,
      title: 'Automated Monitoring',
      description: 'Chainlink Functions monitor weather, prices, and trigger smart contracts',
      icon: <Analytics />,
    },
    {
      step: 4,
      title: 'Earn & Trade',
      description: 'Receive automatic payouts and trade tokenized assets on DeFi platforms',
      icon: <TrendingUp />,
    },
  ];

  const getMainCTAButton = () => {
    if (!connected) {
      return {
        text: 'Connect Wallet to Start',
        action: () => navigate('/'),
        description: 'Connect your wallet to access AgriShield services'
      };
    } else if (!isRegistered) {
      return {
        text: 'Register & Mint Farmer NFT',
        action: () => navigate('/register'),
        description: 'Create your Farmer NFT to unlock all blockchain features'
      };
    } else {
      return {
        text: 'Go to Dashboard',
        action: () => navigate('/dashboard'),
        description: 'Access your personalized farmer dashboard'
      };
    }
  };

  const ctaButton = getMainCTAButton();

  return (
    <Box sx={{ 
      width: '100vw', 
      overflowX: 'hidden', 
      margin: 0, 
      padding: 0,
      fontFamily: '"Inter", "Roboto", sans-serif',
    }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          color: '#1a365d',
          py: { xs: 12, md: 18 },
          textAlign: 'center',
          width: '100vw',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(26, 54, 93, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 54, 93, 0.02) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible} timeout={1200}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="center" gap={0} mb={0}>
                <img src="/logo.png" alt="AgriShield Logo" style={{ height: 150, width: 150, objectFit: 'contain' }} />
                <Typography
                  variant={isMobile ? "h2" : "h1"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 0,
                    fontSize: { xs: '2.75rem', md: '4em' },
                    color: '#1a365d',
                    fontFamily: '"Manrope", "Inter", sans-serif',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                 AgriShield
                </Typography>
              </Box>
              
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  mb: 6, 
                  maxWidth: 800, 
                  mx: 'auto',
                  lineHeight: 1.7,
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontWeight: 400,
                  color: '#4a5568',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                A blockchain platform empowering farmers with weather-triggered insurance, cross-chain microloans, 
                and asset tokenization. Built on Chainlink, Avalanche, and Ethereum.
              </Typography>
              
              {/* Enhanced Trust Indicators */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                gap: 2, 
                mb: 8 
              }}>
                <Chip 
                  icon={<Shield />} 
                  label="Chainlink Powered" 
                  sx={{ 
                    bgcolor: '#e6fffa',
                    color: '#1a365d',
                    border: '1px solid #b2f5ea',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 0.5,
                  }} 
                />
                <Chip 
                  icon={<Verified />} 
                  label="Avalanche & Ethereum" 
                  sx={{ 
                    bgcolor: '#f0f9ff',
                    color: '#1a365d',
                    border: '1px solid #bfdbfe',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 0.5,
                  }} 
                />
                <Chip 
                  icon={<Speed />}
                  label="Automated Payouts" 
                  sx={{ 
                    bgcolor: '#fefcbf',
                    color: '#1a365d',
                    border: '1px solid #fef08a',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 0.5,
                  }} 
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    mb: 2,
                  }}
                >
                  {ctaButton.description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={ctaButton.action}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#1a365d',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    boxShadow: '0 4px 14px rgba(26, 54, 93, 0.15)',
                    '&:hover': {
                      bgcolor: '#2d3748',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(26, 54, 93, 0.2)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {ctaButton.text}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Enhanced Stats Section */}
      <Box sx={{ py: 10, bgcolor: '#ffffff', width: '100vw' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 5,
            textAlign: 'center',
          }}>
            {stats.map((stat, index) => (
              <Fade in={isVisible} timeout={800 + index * 200} key={index}>
                <Box sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: '#fafafa',
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(26, 54, 93, 0.08)',
                    bgcolor: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}>
                  <Box sx={{ color: '#1a365d', mb: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 36 } })}
                  </Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    color: '#1a365d', 
                    mb: 1,
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#4a5568',
                    fontWeight: 500,
                    fontSize: '1rem',
                    mb: 1,
                  }}>
                    {stat.label}
                  </Typography>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Box sx={{ py: 12, width: '100vw', bgcolor: '#fafafa' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h2" gutterBottom sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.25rem', md: '3rem' },
              color: '#1a365d',
              fontFamily: '"Manrope", "Inter", sans-serif',
              mb: 3,
              letterSpacing: '-0.01em',
            }}>
              Blockchain-Powered Agricultural Solutions
            </Typography>
            <Typography variant="h6" sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: '1.2rem',
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 400,
              lineHeight: 1.6,
            }}>
              Revolutionary features powered by Chainlink oracles and cross-chain technology
            </Typography>
          </Box>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 6,
          }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  p: 5,
                  height: '100%',
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    bgcolor: feature.accent,
                  },
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(26, 54, 93, 0.12)',
                    transform: 'translateY(-4px)',
                    borderColor: '#cbd5e0',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: '1.4rem',
                    color: '#1a365d',
                    fontFamily: '"Manrope", "Inter", sans-serif',
                    mb: 2,
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    mb: 4, 
                    lineHeight: 1.7, 
                    color: '#4a5568',
                    fontSize: '1rem',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}>
                    {feature.description}
                  </Typography>
                  
                  <Box>
                    {feature.benefits.map((benefit, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                        <CheckCircle sx={{ fontSize: 22, color: '#059669', mr: 2 }} />
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 12, width: '100vw', bgcolor: '#ffffff' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h2" gutterBottom sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.25rem', md: '3rem' },
              color: '#1a365d',
              fontFamily: '"Manrope", "Inter", sans-serif',
              mb: 3,
            }}>
              How AgriChain Works
            </Typography>
            <Typography variant="h6" sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: '1.2rem',
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              lineHeight: 1.6,
            }}>
              Simple steps to transform your farming operation with blockchain technology
            </Typography>
          </Box>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4,
          }}>
            {howItWorks.map((item, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: '#1a365d', 
                  mx: 'auto', 
                  mb: 3,
                  fontSize: '2rem',
                }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  color: '#1a365d',
                }}>
                  {item.step}. {item.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#4a5568',
                  lineHeight: 1.6,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: '#fafafa', width: '100vw' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ 
            fontWeight: 700,
            fontSize: { xs: '2.25rem', md: '3rem' },
            color: '#1a365d',
            fontFamily: '"Manrope", "Inter", sans-serif',
            mb: 2,
          }}>
            Farmer Success Stories
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ 
            color: '#4a5568',
            fontFamily: '"Inter", "Roboto", sans-serif',
            mb: 8,
            fontSize: '1.2rem',
          }}>
            Real farmers, real results with blockchain technology
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} sx={{ 
                p: 4, 
                height: '100%',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(26, 54, 93, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      mr: 2, 
                      bgcolor: '#1a365d', 
                      fontSize: '1.5rem',
                      width: 56,
                      height: 56,
                    }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600,
                        fontFamily: '"Manrope", "Inter", sans-serif',
                      }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#4a5568',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}>
                        {testimonial.location}
                      </Typography>
                      <Chip 
                        label={testimonial.cropType} 
                        size="small" 
                        sx={{ 
                          mt: 0.5,
                          bgcolor: '#f0f9ff',
                          color: '#1a365d',
                          fontSize: '0.75rem',
                        }} 
                      />
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic', 
                    lineHeight: 1.6,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    position: 'relative',
                    '&::before': {
                      content: '"',
                      fontSize: '2rem',
                      position: 'absolute',
                      left: -8,
                      top: -8,
                      color: '#1a365d',
                      opacity: 0.3,
                    },
                  }}>
                    {testimonial.quote}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Enhanced CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          color: 'white',
          textAlign: 'center',
          width: '100vw',
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 3, md: 4 } }}>
          <Typography variant="h2" gutterBottom sx={{ 
            fontWeight: 700, 
            fontSize: { xs: '2.25rem', md: '3rem' },
            fontFamily: '"Manrope", "Inter", sans-serif',
            mb: 3,
            letterSpacing: '-0.01em',
          }}>
            Ready to Transform Your Farm?
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 6, 
            maxWidth: 500, 
            mx: 'auto',
            fontSize: '1.2rem',
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 400,
            opacity: 0.9,
            lineHeight: 1.6,
          }}>
            Join the agricultural revolution with blockchain-powered farming solutions
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: 3, 
            mb: 6 
          }}>
            <Chip 
              icon={<CheckCircle />} 
              label="Free to Start" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                py: 1.5,
              }} 
            />
            <Chip 
              icon={<Shield />} 
              label="Chainlink Secured" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                py: 1.5,
              }} 
            />
            <Chip 
              icon={<Speed />} 
              label="Instant Setup" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                py: 1.5,
              }} 
            />
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={ctaButton.action}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: '#1a365d',
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
              '&:hover': {
                bgcolor: '#f7fafc',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {ctaButton.text}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
