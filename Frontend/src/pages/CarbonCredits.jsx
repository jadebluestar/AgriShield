import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { Leaf, Award, TrendingUp, Calculator } from 'lucide-react';

// You'll need to add these ABIs to your config
import { CARBON_CREDIT_ABI, CARBON_CREDIT_ADDRESS, FARMER_NFT_ABI, FARMER_NFT_ADDRESS } from '../config/contracts';

const CarbonCredits = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    area: '',
    cropType: '',
    practiceType: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [calculatedTokens, setCalculatedTokens] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Contract interactions
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read user's carbon credit balance
  const { data: carbonBalance, refetch: refetchBalance } = useReadContract({
    address: CARBON_CREDIT_ADDRESS,
    abi: CARBON_CREDIT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address
  });

  // Check if user has Farmer NFT
  const { data: nftBalance } = useReadContract({
    address: FARMER_NFT_ADDRESS,
    abi: FARMER_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address
  });

  const cropTypes = [
    { value: 'wheat', label: 'Wheat', multiplier: 100 },
    { value: 'rice', label: 'Rice', multiplier: 80 },
    { value: 'pulses', label: 'Pulses', multiplier: 120 },
    { value: 'maize', label: 'Maize', multiplier: 110 }
  ];

  const practiceTypes = [
    { value: 'organic', label: 'Organic Farming', multiplier: 130 },
    { value: 'no-till', label: 'No-Till Farming', multiplier: 120 },
    { value: 'biochar', label: 'Biochar Application', multiplier: 150 },
    { value: 'cover', label: 'Cover Cropping', multiplier: 140 },
    { value: 'conventional', label: 'Conventional', multiplier: 100 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTokens = () => {
    if (!formData.area || !formData.cropType || !formData.practiceType) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate the smart contract calculation
    const baseCarbonPerHectare = 1000; // This should match your contract
    const cropMultiplier = cropTypes.find(c => c.value === formData.cropType)?.multiplier || 100;
    const practiceMultiplier = practiceTypes.find(p => p.value === formData.practiceType)?.multiplier || 100;
    
    const carbonSaved = parseInt(formData.area) * baseCarbonPerHectare * cropMultiplier * practiceMultiplier;
    const tokensToMint = carbonSaved / 10000; // Convert to tokens
    
    setTimeout(() => {
      setCalculatedTokens(tokensToMint);
      setIsCalculating(false);
      setOpenDialog(true);
    }, 1000);
  };

  const handleMintTokens = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!nftBalance || nftBalance === 0n) {
      alert('You need to register as a farmer first (mint Farmer NFT)');
      return;
    }

    try {
      await writeContract({
        address: CARBON_CREDIT_ADDRESS,
        abi: CARBON_CREDIT_ABI,
        functionName: 'mintBasedOnSavedCarbon',
        args: [
          BigInt(formData.area),
          formData.cropType,
          formData.practiceType
        ]
      });
    } catch (err) {
      console.error('Error minting tokens:', err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
      setOpenDialog(false);
      setFormData({ area: '', cropType: '', practiceType: '' });
    }
  }, [isConfirmed, refetchBalance]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Carbon Credit Tokenization
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Earn carbon credit tokens based on your sustainable farming practices
        </Typography>
        <Chip 
          icon={<Leaf />} 
          label={`Your Balance: ${carbonBalance ? formatEther(carbonBalance) : '0'} CCT`}
          color="primary" 
          sx={{ fontSize: '1rem', p: 1 }}
        />
      </Box>

      {/* Status Alerts */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please connect your wallet to mint carbon credit tokens
        </Alert>
      )}

      {isConnected && (!nftBalance || nftBalance === 0n) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to register as a farmer first. Please mint your Farmer NFT in the Profile section.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculator size={24} />
                Calculate Carbon Credits
              </Typography>
              
              <Box component="form" sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Farm Area (hectares)"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                  placeholder="Enter area in hectares"
                />

                <TextField
                  fullWidth
                  select
                  label="Crop Type"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                >
                  {cropTypes.map((crop) => (
                    <MenuItem key={crop.value} value={crop.value}>
                      {crop.label} (Multiplier: {crop.multiplier}%)
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Farming Practice"
                  name="practiceType"
                  value={formData.practiceType}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                >
                  {practiceTypes.map((practice) => (
                    <MenuItem key={practice.value} value={practice.value}>
                      {practice.label} (Multiplier: {practice.multiplier}%)
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={calculateTokens}
                  disabled={!formData.area || !formData.cropType || !formData.practiceType || isCalculating}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isCalculating ? <CircularProgress size={24} /> : 'Calculate Tokens'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp size={20} />
                How It Works
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our carbon credit system rewards farmers for sustainable practices that reduce carbon footprint:
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" gutterBottom>• Different crops have different carbon saving potential</Typography>
                <Typography variant="body2" gutterBottom>• Sustainable practices multiply your carbon savings</Typography>
                <Typography variant="body2" gutterBottom>• Tokens are minted based on calculated carbon savings</Typography>
                <Typography variant="body2" gutterBottom>• 1 CCT = 10,000 units of carbon saved</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Award size={20} />
                Multipliers
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Crop Multipliers:</Typography>
              <TableContainer component={Paper} sx={{ mb: 2, maxHeight: 200 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Crop</TableCell>
                      <TableCell align="right">Multiplier</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cropTypes.map((crop) => (
                      <TableRow key={crop.value}>
                        <TableCell>{crop.label}</TableCell>
                        <TableCell align="right">{crop.multiplier}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle2" gutterBottom>Practice Multipliers:</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Practice</TableCell>
                      <TableCell align="right">Multiplier</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {practiceTypes.map((practice) => (
                      <TableRow key={practice.value}>
                        <TableCell>{practice.label}</TableCell>
                        <TableCell align="right">{practice.multiplier}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mint Carbon Credit Tokens</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {calculatedTokens?.toFixed(4)} CCT
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Tokens to be minted based on your farming data
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" gutterBottom>
                <strong>Area:</strong> {formData.area} hectares
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Crop:</strong> {cropTypes.find(c => c.value === formData.cropType)?.label}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Practice:</strong> {practiceTypes.find(p => p.value === formData.practiceType)?.label}
              </Typography>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleMintTokens}
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? <CircularProgress size={20} /> : 'Mint Tokens'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarbonCredits;