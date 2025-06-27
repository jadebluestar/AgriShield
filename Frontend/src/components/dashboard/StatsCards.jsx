import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Security, Nature, CreditScore } from '@mui/icons-material';

const StatsCards = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statsData = [
    {
      title: 'Carbon Credits',
      value: stats.carbonCredits,
      unit: 'Credits',
      icon: <Nature sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+12%',
      trendUp: true,
      progress: (stats.carbonCredits / 200) * 100,
      color: '#1a365d',
      accent: '#f0fff4',
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans,
      unit: 'Loans',
      icon: <AccountBalance sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: 'Stable',
      trendUp: null,
      progress: (stats.activeLoans / 5) * 100,
      color: '#1a365d',
      accent: '#f0f9ff',
    },
    {
      title: 'Insurance Policies',
      value: stats.insurancePolicies,
      unit: 'Policies',
      icon: <Security sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+1',
      trendUp: true,
      progress: (stats.insurancePolicies / 10) * 100,
      color: '#1a365d',
      accent: '#e6fffa',
    },
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(stats.totalValue),
      unit: '',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+8.5%',
      trendUp: true,
      progress: 75,
      color: '#1a365d',
      accent: '#fefcbf',
    },
    {
      title: 'Credit Score',
      value: stats.creditScore,
      unit: 'Score',
      icon: <CreditScore sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+25',
      trendUp: true,
      progress: (stats.creditScore / 850) * 100,
      color: '#1a365d',
      accent: '#f0fff4',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: stat.accent,
              },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(26, 54, 93, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {stat.icon}
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: stat.color,
                      fontFamily: '"Manrope", "Inter", sans-serif',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  {stat.unit && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4a5568',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      {stat.unit}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#4a5568', 
                  mb: 2,
                  fontWeight: 500,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                {stat.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {stat.trendUp === true && <TrendingUp sx={{ fontSize: 16, color: '#059669', mr: 0.5 }} />}
                {stat.trendUp === false && <TrendingDown sx={{ fontSize: 16, color: '#dc2626', mr: 0.5 }} />}
                <Chip
                  label={stat.trend}
                  size="small"
                  sx={{
                    bgcolor: stat.trendUp === true ? '#dcfce7' : stat.trendUp === false ? '#fef2f2' : '#f1f5f9',
                    color: stat.trendUp === true ? '#166534' : stat.trendUp === false ? '#dc2626' : '#475569',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={stat.progress} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stat.color,
                    borderRadius: 3,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;
