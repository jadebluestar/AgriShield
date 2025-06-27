import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Avatar,
  Chip,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Skeleton,
} from '@mui/material';
import {
  Person,
  LocationOn,
  Agriculture,
  Verified,
  CloudUpload,
  CheckCircle,
  Warning,
  Edit,
  Save,
  Cancel,
  AccountBalanceWallet,
  AppRegistration,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useFarmerNFT } from '../../hooks/useContracts';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { farmerData, updateFarmerData, isRegistered } = useApp();
  const { useHasNFT } = useFarmerNFT();
  
  // Check if user has NFT
  const { data: nftBalance, isLoading: nftLoading } = useHasNFT(address);
  const hasNFT = nftBalance && Number(nftBalance) > 0;
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(farmerData);
  
  // Update form data when farmerData changes
  useEffect(() => {
    setFormData(farmerData);
  }, [farmerData]);

  const handleEdit = () => {
    setEditing(true);
    setFormData(farmerData);
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateFarmerData(formData);
      setEditing(false);
      setLoading(false);
    }, 1500);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(farmerData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <Box sx={{ width: '100vw', overflowX: 'hidden', bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', px: { xs: 3, md: 4 }, py: 4 }}>
          <Card sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <AccountBalanceWallet sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Connect Your Wallet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please connect your wallet to view and manage your farmer profile.
              </Typography>
              <Button 
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ 
                  bgcolor: '#1a365d',
                  '&:hover': { bgcolor: '#2d3748' }
                }}
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Show registration prompt if not registered or doesn't have NFT
  if (!isRegistered() || (!hasNFT && !nftLoading)) {
    return (
      <Box sx={{ width: '100vw', overflowX: 'hidden', bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', px: { xs: 3, md: 4 }, py: 4 }}>
          <Card sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <AppRegistration sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Complete Registration
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You need to complete your farmer registration and mint your NFT to access your profile.
              </Typography>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#1a365d',
                  '&:hover': { bgcolor: '#2d3748' }
                }}
              >
                Complete Registration
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Show loading state while checking NFT
  if (nftLoading) {
    return (
      <Box sx={{ width: '100vw', overflowX: 'hidden', bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100vw', px: { xs: 3, md: 4 }, py: 4 }}>
          <Box sx={{ mb: 6 }}>
            <Skeleton variant="text" width={400} height={60} />
            <Skeleton variant="text" width={600} height={30} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Container>
      </Box>
    );
  }

  const kycRequirements = [
    { label: 'Government ID Verification', completed: true },
    { label: 'Address Proof', completed: true },
    { label: 'Land Ownership Documents', completed: farmerData.kycStatus === 'Verified' },
    { label: 'Bank Account Verification', completed: farmerData.kycStatus === 'Verified' },
    { label: 'Agricultural License', completed: true },
    { label: 'NFT Verification', completed: hasNFT },
  ];

  const completedRequirements = kycRequirements.filter(req => req.completed).length;

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
            👨‍🌾 Farmer Profile Management
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              maxWidth: 600,
            }}
          >
            Manage your profile information and complete KYC verification for full platform access
          </Typography>
          
          {/* Connection Status */}
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<AccountBalanceWallet />}
              label={`Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`}
              color="success"
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Chip
              icon={<Verified />}
              label={hasNFT ? 'NFT Verified' : 'NFT Pending'}
              color={hasNFT ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 4,
          mb: 6,
        }}>
          {/* Profile Overview */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 3,
                  bgcolor: '#1a365d',
                  fontSize: '3rem'
                }}
              >
                👨‍🌾
              </Avatar>
              
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                }}
              >
                {farmerData.name}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <Chip
                  icon={<Verified />}
                  label={`KYC: ${farmerData.kycStatus}`}
                  color={farmerData.kycStatus === 'Verified' ? 'success' : 'warning'}
                />
                <Chip
                  icon={<CheckCircle />}
                  label={hasNFT ? 'NFT Holder' : 'NFT Pending'}
                  color={hasNFT ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                  {farmerData.location}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: 1,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <Agriculture sx={{ mr: 1, fontSize: 16 }} />
                  {farmerData.farmSize}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Member since {new Date(farmerData.joinDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ 
                  mb: 2,
                  bgcolor: '#1a365d',
                  '&:hover': { bgcolor: '#2d3748' }
                }}
                disabled
              >
                Upload Profile Photo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={editing ? <Cancel /> : <Edit />}
                fullWidth
                onClick={editing ? handleCancel : handleEdit}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#1a365d',
                  '&:hover': {
                    borderColor: '#1a365d',
                    bgcolor: '#f7fafc',
                  },
                }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                  variant="h6"
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Profile Information
                </Typography>
                {editing && (
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      bgcolor: '#1a365d',
                      '&:hover': { bgcolor: '#2d3748' }
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </Box>

              {loading && <LinearProgress sx={{ mb: 3 }} />}

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editing ? formData.name : farmerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editing}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Location"
                  value={editing ? formData.location : farmerData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!editing}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Farm Size"
                  value={editing ? formData.farmSize : farmerData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  disabled={!editing}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Crop Types"
                  value={editing ? formData.cropType : farmerData.cropType}
                  onChange={(e) => handleInputChange('cropType', e.target.value)}
                  disabled={!editing}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Experience"
                  value={editing ? formData.experience : farmerData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!editing}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Wallet Address"
                  value={farmerData.walletAddress || 'Not connected'}
                  disabled={true}
                  sx={{ mb: 2 }}
                  helperText="Your connected wallet address"
                />

                <Box sx={{ gridColumn: { md: 'span 2' } }}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    multiline
                    rows={3}
                    value={editing ? (formData.additionalInfo || '') : (farmerData.additionalInfo || '')}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Tell us more about your farming practices, specializations, or goals..."
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* KYC Verification */}
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
              KYC Verification Status
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="body2"
                  sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                >
                  Verification Progress
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {completedRequirements}/{kycRequirements.length} Completed
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={(completedRequirements / kycRequirements.length) * 100} 
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
            </Box>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
            }}>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Verification Requirements
                </Typography>
                
                <List>
                  {kycRequirements.map((requirement, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {requirement.completed ? (
                          <CheckCircle sx={{ color: '#059669' }} />
                        ) : (
                          <Warning sx={{ color: '#f59e0b' }} />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={requirement.label}
                        secondary={requirement.completed ? 'Verified' : 'Pending'}
                        primaryTypographyProps={{
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                        secondaryTypographyProps={{
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Next Steps
                </Typography>
                
                {completedRequirements === kycRequirements.length ? (
                  <Alert severity="success">
                    <Typography 
                      variant="body2"
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                    >
                      🎉 Congratulations! Your KYC verification is complete. 
                      You now have full access to all AgriChain features.
                    </Typography>
                  </Alert>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography 
                        variant="body2"
                        sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                      >
                        Complete your KYC verification to unlock all platform features including higher loan limits and premium insurance options.
                      </Typography>
                    </Alert>
                    
                    {!hasNFT && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/register')}
                        sx={{ 
                          mb: 2,
                          bgcolor: '#f59e0b',
                          '&:hover': { bgcolor: '#d97706' }
                        }}
                      >
                        Complete NFT Registration
                      </Button>
                    )}
                    
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mb: 2,
                        bgcolor: '#1a365d',
                        '&:hover': { bgcolor: '#2d3748' }
                      }}
                      disabled
                    >
                      Upload Additional Documents
                    </Button>
                    
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
                      disabled
                    >
                      Contact Support
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Platform Benefits */}
        <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none', mt: 4 }}>
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
              Platform Benefits & Features
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
            }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Agriculture sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Weather Insurance
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Automated payouts based on weather conditions
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Person sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Cross-Chain Lending
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Access microloans across multiple blockchains
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Verified sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  Carbon Credits
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Earn and trade tokenized carbon credits
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircle sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  DeFi Integration
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Connect with decentralized finance protocols
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileManagement;