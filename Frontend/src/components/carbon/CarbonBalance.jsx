// src/components/carbon/CarbonBalance.jsx

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Tooltip
} from '@mui/material';
import { Leaf, TrendingUp, Award, Info } from 'lucide-react';
import { formatEther } from 'viem';

const CarbonBalance = ({ 
  balance, 
  isLoading, 
  totalSupply, 
  userRank,
  showDetails = true 
}) => {
  const formatBalance = (bal) => {
    if (!bal) return '0';
    const formatted = formatEther(bal);
    const num = parseFloat(formatted);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(4);
  };

  const calculatePercentage = () => {
    if (!balance || !totalSupply || totalSupply === 0n) return 0;
    return ((parseFloat(formatEther(balance)) / parseFloat(formatEther(totalSupply))) * 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
          {showDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={60} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={60} />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={24} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {formatBalance(balance)} CCT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your Carbon Credit Balance
            </Typography>
          </Box>
          <Tooltip title="Carbon Credit Tokens represent your contribution to carbon reduction">
            <Info size={20} color="#666" />
          </Tooltip>
        </Box>

        {showDetails && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <TrendingUp size={24} color="#4CAF50" />
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {calculatePercentage().toFixed(2)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Of Total Supply
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Award size={24} color="#FF9800" />
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  #{userRank || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Global Rank
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Leaf size={24} color="#2196F3" />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {formatBalance(totalSupply)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Supply
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            💡 <strong>Tip:</strong> Increase your carbon credits by:
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Using sustainable farming practices like organic or no-till farming
            <br />
            • Growing nitrogen-fixing crops like pulses
            <br />
            • Implementing biochar application for maximum carbon sequestration
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarbonBalance;