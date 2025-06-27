// src/pages/Registration.jsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Agriculture, Badge } from '@mui/icons-material';
import WalletConnect from '../components/WalletConnect';
import { useFarmerNFT, useTransactionStatus } from '../hooks/useContracts';
import { useAppContext } from '../context/AppContext';

const Registration = () => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { updateFarmerData } = useAppContext();

  const { registerFarmer, useHasNFT, nftHash, nftError, nftPending } = useFarmerNFT();
  const { data: txReceipt, isLoading: txLoading } = useTransactionStatus(nftHash);

  const isSupportedNetwork = chainId === sepolia.id;

  const { data: nftBalance } = useHasNFT(address);
  const hasNFT = nftBalance && Number(nftBalance) > 0;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    farmSize: '',
    cropType: '',
    experience: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () =>
    formData.name &&
    formData.location &&
    formData.farmSize &&
    formData.cropType &&
    formData.experience &&
    Number(formData.farmSize) > 0 &&
    Number(formData.experience) >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isSupportedNetwork) {
      alert('Please switch to Sepolia testnet to register.');
      try {
        await switchChain({ chainId: sepolia.id });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
      return;
    }

    if (hasNFT) {
      alert('You already have a farmer NFT!');
      return;
    }

    try {
      await registerFarmer(
        address,
        formData.name,
        formData.location,
        formData.cropType
      );

      const newFarmerData = {
        name: formData.name,
        location: formData.location,
        farmSize: `${formData.farmSize} acres`,
        cropType: formData.cropType,
        experience: `${formData.experience} years`,
        kycStatus: 'Pending',
        joinDate: new Date().toISOString(),
        walletAddress: address,
      };

      updateFarmerData(newFarmerData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  useEffect(() => {
    if (txReceipt && !txLoading) {
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }
  }, [txReceipt, txLoading, navigate]);

  if (!isSupportedNetwork && isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Unsupported Network
          </Typography>
          <Typography variant="body1">
            Please switch to Sepolia testnet to register. The farmer NFT contract is only deployed there.
          </Typography>
          <Button
            variant="contained"
            onClick={() => switchChain({ chainId: sepolia.id })}
            sx={{ mt: 2 }}
          >
            Switch to Sepolia
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Farmer Registration
        </Typography>
        <WalletConnect />
      </Container>
    );
  }

  if (hasNFT) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ maxWidth: 500, margin: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Badge sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Registration Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You already have a farmer NFT. You can now access all services.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => navigate('/profile')}>
                View Profile
              </Button>
              <Button variant="outlined" onClick={() => navigate('/insurance')}>
                Get Insurance
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Agriculture color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">Farmer Registration</Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Register as a farmer to access weather-based insurance services. You'll receive an NFT that serves as your
          digital farmer identity.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Enter your full name"
            />

            <TextField
              name="location"
              label="Farm Location (City, State)"
              value={formData.location}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="This will be used for weather data tracking"
              placeholder="e.g., Mumbai, Maharashtra"
            />

            <TextField
              name="farmSize"
              label="Farm Size (in acres)"
              type="number"
              value={formData.farmSize}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0.1, step: 0.1 }}
              placeholder="e.g., 5.5"
            />

            <TextField
              name="cropType"
              label="Primary Crop Type"
              value={formData.cropType}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="e.g., Rice, Wheat, Cotton"
              helperText="What is your main crop?"
            />

            <TextField
              name="experience"
              label="Years of Farming Experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              placeholder="e.g., 10"
            />

            {nftError && (
              <Alert severity="error">
                <strong>Registration failed:</strong>
                <br />
                {nftError?.message || 'Unknown error occurred'}
              </Alert>
            )}

            {nftHash && !txReceipt && (
              <Alert severity="info">
                Transaction submitted! Waiting for confirmation...
                <br />
                <strong>Hash:</strong> {nftHash}
              </Alert>
            )}

            {txReceipt && (
              <Alert severity="success">
                🎉 Registration successful! Your farmer NFT has been minted.
                <br />
                <strong>Transaction:</strong> {txReceipt.transactionHash}
                <br />
                <em>Redirecting to profile...</em>
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={nftPending || txLoading || !isFormValid()}
              sx={{ mt: 2, py: 1.5 }}
            >
              {nftPending || txLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing Registration...
                </>
              ) : (
                'Register as Farmer & Mint NFT'
              )}
            </Button>

            {!isFormValid() && (
              <Typography variant="body2" color="text.secondary" align="center">
                Please fill all fields to continue
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Registration;
