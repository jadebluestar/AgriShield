// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Person,
  LocationOn,
  Agriculture,
  Timeline,
  Badge,
  AccountBalanceWallet,
  CalendarToday,
  Verified,
  Warning,
  Landscape
} from '@mui/icons-material';
import WalletConnect from '../components/WalletConnect';
import { useAppContext } from '../context/AppContext';
import { useFarmerNFT } from '../hooks/useContracts';

const Profile = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { farmerData } = useAppContext();
  const { useHasNFT } = useFarmerNFT();
  const { data: nftBalance, isLoading: nftLoading } = useHasNFT(address);
  
  const [profileStats, setProfileStats] = useState({
    totalInsurancePolicies: 0,
    activePolicies: 1,
    carbonCredits: 0,
    memberSince: null
  });

  const hasNFT = nftBalance && Number(nftBalance) > 0;

  useEffect(() => {
    if (farmerData) {
      setProfileStats(prev => ({
        ...prev,
        memberSince: new Date(farmerData.joinDate).toLocaleDateString()
      }));
    }
  }, [farmerData]);

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please connect your wallet to view your profile
        </Alert>
        <WalletConnect />
      </Container>
    );
  }

  if (nftLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your profile...
        </Typography>
      </Container>
    );
  }

  if (!hasNFT || !farmerData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No farmer profile found. Please register first to create your profile.
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/register')}
            size="large"
          >
            Register as Farmer
          </Button>
        </Box>
      </Container>
    );
  }

  const getKycStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {farmerData.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <LocationOn color="action" />
              <Typography variant="body1" color="text.secondary">
                {farmerData.location}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<Verified />}
                label={`KYC: ${farmerData.kycStatus || 'Pending'}`}
                color={getKycStatusColor(farmerData.kycStatus)}
                variant="outlined"
              />
              <Chip
                icon={<Badge />}
                label="Farmer NFT Holder"
                color="success"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Farmer Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Agriculture sx={{ mr: 1, verticalAlign: 'middle' }} />
                Farm Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Landscape />
                  </ListItemIcon>
                  <ListItemText
                    primary="Farm Size"
                    secondary={farmerData.farmSize}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Agriculture />
                  </ListItemIcon>
                  <ListItemText
                    primary="Primary Crop"
                    secondary={farmerData.cropType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText
                    primary="Farming Experience"
                    secondary={farmerData.experience}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Member Since"
                    secondary={profileStats.memberSince || 'Recently joined'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceWallet />
                  </ListItemIcon>
                  <ListItemText
                    primary="Wallet Address"
                    secondary={formatAddress(address)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Alert severity="info">
                <Typography variant="body2">
                  🎉 Successfully registered as a farmer and received your NFT!
                </Typography>
              </Alert>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  • Farmer NFT minted successfully
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Profile created and verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Ready to access insurance services
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Stats and Actions */}
        <Grid item xs={12} md={4}>
          {/* Stats Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary">
                  {Number(nftBalance) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Farmer NFTs Owned
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Insurance Policies</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {profileStats.activePolicies}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Carbon Credits</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {profileStats.carbonCredits}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Policies</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {profileStats.totalInsurancePolicies}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/insurance')}
                >
                  Get Weather Insurance
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/carbon-credits')}
                >
                  Earn Carbon Credits
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;