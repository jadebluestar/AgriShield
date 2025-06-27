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
  Container,
  Grid,
  Avatar,
  Chip,
  FormHelperText,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  Person,
  Agriculture,
  LocationOn,
  PhotoCamera,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
// Replace Web3Context with Wagmi hooks
import { useAccount } from 'wagmi';

const FarmerRegistration = () => {
  const { updateFarmerData } = useApp();
  // Use Wagmi's useAccount hook instead of custom Web3 context
  const { address: account, isConnected: connected } = useAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    location: 'Madhya Pradesh',
    cropType: 'Wheat',
    farmingMethod: 'Organic',
    farmSize: '4.5',
    yearsOfExperience: '',
    cropImage: null,
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1);

  // Dropdown options
  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane', 
    'Barley', 'Oats', 'Millet', 'Sorghum', 'Pulses', 'Vegetables',
    'Fruits', 'Spices', 'Tea', 'Coffee', 'Other'
  ];

  const farmingMethods = [
    'Organic', 'Conventional', 'Sustainable', 'Precision Agriculture',
    'Hydroponics', 'Permaculture', 'Biodynamic', 'No-Till', 'Mixed Farming'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, cropImage: 'Please upload a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cropImage: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, cropImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, cropImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.farmSize || parseFloat(formData.farmSize) <= 0) {
      newErrors.farmSize = 'Farm size must be greater than 0';
    }

    if (!formData.yearsOfExperience || parseInt(formData.yearsOfExperience) < 0) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    } else if (parseInt(formData.yearsOfExperience) > 80) {
      newErrors.yearsOfExperience = 'Please enter a realistic number of years';
    }

    if (!formData.cropImage) {
      newErrors.cropImage = 'Crop image is required for NFT creation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setRegistrationStep(2);

    try {
      // Simulate NFT creation process
      setTimeout(() => {
        setRegistrationStep(3);
        
        // Update farmer data
        updateFarmerData({
          name: formData.name,
          location: formData.location,
          cropType: formData.cropType,
          farmingMethod: formData.farmingMethod,
          farmSize: `${formData.farmSize} acres`,
          yearsOfExperience: formData.yearsOfExperience,
          email: formData.email,
          phone: formData.phone,
          kycStatus: 'Verified',
          nftCreated: true,
          registrationDate: new Date().toISOString(),
        });

        setTimeout(() => {
          setLoading(false);
          setRegistrationStep(4);
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
      setRegistrationStep(1);
    }
  };

  if (!connected) {
    return (
      <Box sx={{ 
        width: '100vw', 
        overflowX: 'hidden', 
        bgcolor: '#fafafa', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="md">
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center', p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a365d' }}>
              Connect Wallet Required
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5568', mb: 3 }}>
              Please connect your wallet to register as a farmer and create your NFT
            </Typography>
            {/* Display wallet address if connected */}
            {account && (
              <Typography variant="body2" sx={{ color: '#059669', fontFamily: 'monospace' }}>
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </Typography>
            )}
          </Card>
        </Container>
      </Box>
    );
  }

  // Rest of your component remains the same...
  if (registrationStep === 4) {
    return (
      <Box sx={{ 
        width: '100vw', 
        overflowX: 'hidden', 
        bgcolor: '#fafafa', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="md">
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center', p: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#059669', mb: 3 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a365d' }}>
              🎉 Registration Successful!
            </Typography>
            <Typography variant="h6" sx={{ color: '#4a5568', mb: 4 }}>
              Your Farmer NFT has been created successfully
            </Typography>
            <Box sx={{ bgcolor: '#f0fff4', p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                NFT Details:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Name:</strong> {formData.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Location:</strong> {formData.location}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Crop:</strong> {formData.cropType} ({formData.farmingMethod})
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Farm Size:</strong> {formData.farmSize} acres
              </Typography>
              <Typography variant="body2">
                <strong>Experience:</strong> {formData.yearsOfExperience} years
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = '/dashboard'}
              sx={{
                bgcolor: '#1a365d',
                px: 4,
                py: 2,
                '&:hover': { bgcolor: '#2d3748' }
              }}
            >
              Go to Dashboard
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100vw', 
      overflowX: 'hidden', 
      bgcolor: '#fafafa', 
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: '#1a365d',
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            👨‍🌾 Farmer Registration & NFT Creation
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Register your farm details and create your unique Farmer NFT to access AgriChain services
          </Typography>
        </Box>

        {/* Progress Steps */}
        <Paper sx={{ p: 3, mb: 4, border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { step: 1, label: 'Farm Details', icon: <Agriculture /> },
              { step: 2, label: 'NFT Creation', icon: <PhotoCamera /> },
              { step: 3, label: 'Verification', icon: <CheckCircle /> },
              { step: 4, label: 'Complete', icon: <Person /> },
            ].map((item, index) => (
              <Box key={item.step} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: registrationStep >= item.step ? '#1a365d' : '#e2e8f0',
                      color: registrationStep >= item.step ? 'white' : '#4a5568',
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      color: registrationStep >= item.step ? '#1a365d' : '#4a5568',
                      fontWeight: registrationStep >= item.step ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                {index < 3 && (
                  <Box
                    sx={{
                      height: 2,
                      flex: 1,
                      bgcolor: registrationStep > item.step ? '#1a365d' : '#e2e8f0',
                      mx: 2,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        {registrationStep === 1 && (
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 6 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 4,
                }}
              >
                Farmer Registration Form
              </Typography>

              <Grid container spacing={4}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a365d' }}>
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="Enter your full name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    placeholder="Enter your email address"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="Enter 10-digit phone number"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location (State) *</InputLabel>
                    <Select
                      value={formData.location}
                      label="Location (State) *"
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    >
                      {indianStates.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Farm Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a365d', mt: 2 }}>
                    Farm Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Crop Type *</InputLabel>
                    <Select
                      value={formData.cropType}
                      label="Crop Type *"
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                    >
                      {cropTypes.map((crop) => (
                        <MenuItem key={crop} value={crop}>
                          {crop}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Farming Method *</InputLabel>
                    <Select
                      value={formData.farmingMethod}
                      label="Farming Method *"
                      onChange={(e) => handleInputChange('farmingMethod', e.target.value)}
                    >
                      {farmingMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Farm Size (Acres) *"
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    error={!!errors.farmSize}
                    helperText={errors.farmSize || 'Enter farm size in acres'}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience (YoE) *"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    error={!!errors.yearsOfExperience}
                    helperText={errors.yearsOfExperience || 'Enter years of farming experience'}
                    inputProps={{ min: 0, max: 80 }}
                  />
                </Grid>

                {/* Crop Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a365d', mt: 2 }}>
                    Crop Image Upload *
                  </Typography>
                  
                  <Box sx={{ 
                    border: '2px dashed #e2e8f0', 
                    borderRadius: 2, 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: '#f7fafc',
                    '&:hover': {
                      borderColor: '#1a365d',
                      bgcolor: '#f0f9ff',
                    },
                    transition: 'all 0.2s ease',
                  }}>
                    {imagePreview ? (
                      <Box>
                        <img
                          src={imagePreview}
                          alt="Crop preview"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#059669', mb: 2 }}>
                          ✓ Image uploaded successfully
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{ borderColor: '#1a365d', color: '#1a365d' }}
                        >
                          Change Image
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <CloudUpload sx={{ fontSize: 48, color: '#4a5568', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, color: '#1a365d' }}>
                          Upload Crop Image
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
                          Upload a clear image of your crop for NFT creation
                        </Typography>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{ bgcolor: '#1a365d', '&:hover': { bgcolor: '#2d3748' } }}
                        >
                          Choose Image
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </Box>
                    )}
                    
                    {errors.cropImage && (
                      <FormHelperText error sx={{ textAlign: 'center', mt: 2 }}>
                        {errors.cropImage}
                      </FormHelperText>
                    )}
                  </Box>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <Info sx={{ mr: 1, fontSize: 16 }} />
                      This image will be used to create your unique Farmer NFT. 
                      Supported formats: JPG, PNG, GIF (Max size: 5MB)
                    </Typography>
                  </Alert>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        bgcolor: '#1a365d',
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#2d3748' },
                      }}
                    >
                      Create Farmer NFT & Register
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {(registrationStep === 2 || registrationStep === 3) && (
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center', p: 6 }}>
            <Box sx={{ mb: 4 }}>
              {registrationStep === 2 && (
                <>
                  <CloudUpload sx={{ fontSize: 80, color: '#1a365d', mb: 3 }} />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a365d' }}>
                    Creating Your Farmer NFT...
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
                    Uploading crop image to IPFS and minting your unique NFT
                  </Typography>
                </>
              )}
              
              {registrationStep === 3 && (
                <>
                  <CheckCircle sx={{ fontSize: 80, color: '#059669', mb: 3 }} />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a365d' }}>
                    Verifying Registration...
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
                    Finalizing your farmer profile and NFT creation
                  </Typography>
                </>
              )}
            </Box>
            
            <LinearProgress sx={{ mb: 4, height: 8, borderRadius: 4 }} />
            
            <Box sx={{ bgcolor: '#f7fafc', p: 3, borderRadius: 2, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Processing Steps:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Form validation completed
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {registrationStep >= 2 ? '✓' : '⏳'} Uploading crop image to IPFS
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {registrationStep >= 3 ? '✓' : '⏳'} Minting Farmer NFT
              </Typography>
              <Typography variant="body2">
                {registrationStep >= 3 ? '✓' : '⏳'} Registering farmer profile
              </Typography>
            </Box>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default FarmerRegistration;