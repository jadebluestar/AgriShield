# AgriShield - Quick Start Guide for Fixes

## 🚀 Immediate Actions Required

### 1. Copy the InsuranceModule.jsx Template

Create the file manually at:
`Frontend/src/components/insurance/InsuranceModule.jsx`

Use this minimal working version (to be expanded):

```jsx
import React, { useState, useEffect } from 'react';
import { useInsurance } from '../../hooks/useInsurance';
import { fetchCurrentWeather, getDroughtRisk } from '../../services/weatherService';
import {
  Card, CardContent, Typography, Button, Box, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Alert, Container, Grid
} from '@mui/material';

const InsuranceModule = () => {
  const [location, setLocation] = useState('New York');
  const [coverage, setCoverage] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  
  const { policies, createPolicy, cancelPolicy, loading, error, fetchPolicies, isConnected } = useInsurance();

  useEffect(() => {
    if (isConnected) fetchPolicies();
  }, [isConnected, fetchPolicies]);

  useEffect(() => {
    const loadWeather = async () => {
      const weather = await fetchCurrentWeather(location);
      setWeatherData(weather);
    };
    if (location) loadWeather();
  }, [location]);

  const handleCreate = async () => {
    if (!coverage || !location) return alert('Fill all fields');
    await createPolicy(location, coverage);
    setCoverage('');
  };

  if (!isConnected) {
    return (
      <Container><Card><CardContent>
        <Typography variant="h4">Connect Wallet Required</Typography>
        <Typography>Please connect your wallet to use insurance</Typography>
      </CardContent></Card></Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>🛡️ Weather Insurance</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create New Policy</Typography>
              <TextField 
                fullWidth 
                label="Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                sx={{ mb: 2 }}
              />
              <TextField 
                fullWidth 
                label="Coverage (ETH)" 
                type="number" 
                value={coverage} 
                onChange={(e) => setCoverage(e.target.value)} 
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Policy'}
              </Button>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weather - {location}</Typography>
              {weatherData ? (
                <Box>
                  <Typography>Temperature: {weatherData.temperature}°C</Typography>
                  <Typography>Condition: {weatherData.condition}</Typography>
                  <Typography>Humidity: {weatherData.humidity}%</Typography>
                </Box>
              ) : <Typography>Loading weather...</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Policies ({policies.length})</Typography>
              {policies.length > 0 ? (
                <Grid container spacing={2}>
                  {policies.map((p, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography>Policy #{p.id?.toString() || idx}</Typography>
                          <Typography variant="body2">Location: {p.location}</Typography>
                          <Typography variant="body2">
                            Coverage: {p.coverageAmount ? (Number(p.coverageAmount) / 1e18).toFixed(4) : '0'} ETH
                          </Typography>
                          <Chip label={p.active ? 'Active' : 'Cancelled'} color={p.active ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={() => p.active && cancelPolicy(Number(p.id))}
                            disabled={!p.active || loading}
                          >
                            {p.active ? 'Cancel' : 'Cancelled'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No policies yet. Create one above!</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InsuranceModule;
```

### 2. Add Logout to Header

Edit `Frontend/src/components/common/Header.jsx`, add inside the wallet menu:

```jsx
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Inside component:
const { clearFarmerData } = useAppContext();
const navigate = useNavigate();

const handleLogout = () => {
  disconnect();
  clearFarmerData();
  localStorage.clear();
  navigate('/');
  handleWalletMenuClose();
};

// Add MenuItem in wallet dropdown:
<MenuItem onClick={handleLogout}>
  <ExitToApp sx={{ mr: 1 }} />
  Logout
</MenuItem>
```

### 3. Update FarmerRegistration for Pinata

Edit `Frontend/src/components/registration/FarmerRegistration.jsx`:

```jsx
import { createFarmerNFTMetadata } from '../../services/pinataService';
import { useFarmerNFT } from '../../hooks/useFarmerNFT';

// Inside component:
const { registerFarmer } = useFarmerNFT();

// Update handleSubmit:
const handleSubmit = async () => {
  if (!validateForm()) return;
  setLoading(true);
  setRegistrationStep(2);

  try {
    const metadataUri = await createFarmerNFTMetadata(formData.cropImage, {
      name: formData.name,
      location: formData.location,
      cropType: formData.cropType,
      farmingMethod: formData.farmingMethod,
      farmSize: formData.farmSize,
      yearsOfExperience: formData.yearsOfExperience,
      email: formData.email,
      phone: formData.phone,
      walletAddress: account,
    });
    
    setRegistrationStep(3);
    await registerFarmer(account, formData.name, formData.location, formData.cropType);
    
    updateFarmerData({...formData, nftCreated: true, registrationDate: new Date().toISOString()});
    setRegistrationStep(4);
  } catch (error) {
    console.error('Registration failed:', error);
    setLoading(false);
    setRegistrationStep(1);
  }
};
```

### 4. Create .env File

Create `Frontend/.env`:

```env
# Optional - defaults to mock data
VITE_WEATHER_API_KEY=

# Optional - defaults to base64 encoding
VITE_PINATA_JWT=
```

Get keys from:
- Weather: https://openweathermap.org/api (free)
- Pinata: https://www.pinata.cloud/ (free tier)

### 5. Test the Application

```bash
cd Frontend
npm install
npm run dev
```

Test flow:
1. Connect wallet → Register as farmer → Upload crop image
2. Go to Insurance → Create policy → View multiple policies
3. Cancel a policy → Should show as "Cancelled"
4. Check weather data loads
5. Click logout → Should disconnect and clear data

---

## ⚠️ Known Issues & Solutions

### Issue: "Cannot find module weatherService"
**Solution:** The file was created at `Frontend/src/services/weatherService.js`
If missing, copy from the backup in project root.

### Issue: "Cannot find module pinataService"
**Solution:** The file was created at `Frontend/src/services/pinataService.js`
If missing, copy from the backup in project root.

### Issue: InsuranceModule not working
**Solution:** Use the minimal template above first, then enhance gradually.

### Issue: Policies not showing
**Solution:** Check that `getPolicies` function exists in smart contract and useInsurance hook is calling it correctly.

---

## 📦 Files Created/Modified Summary

### ✅ Created (New Files):
- `Frontend/src/services/weatherService.js` - Weather API integration
- `Frontend/src/services/pinataService.js` - IPFS upload service
- `FIXES_SUMMARY.md` - Complete documentation
- `QUICK_START.md` - This file

### ✅ Modified (Existing Files):
- `Frontend/src/hooks/useInsurance.js` - Fixed to support multiple policies
- `Frontend/src/components/registration/FarmerRegistration.jsx` - Fixed useApp import

### 🔄 Needs Manual Creation:
- `Frontend/src/components/insurance/InsuranceModule.jsx` - Use template above

### 📝 Needs Manual Edit:
- `Frontend/src/components/common/Header.jsx` - Add logout button
- `Frontend/.env` - Add API keys

---

## 🎯 Success Criteria

Your project is fully fixed when:
- ✅ Multiple insurance policies can be created
- ✅ Individual policies can be cancelled
- ✅ Weather data displays (even if mock)
- ✅ NFT registration works
- ✅ Logout button works
- ✅ UI is responsive and clean

---

*Quick Start Guide - AgriShield Project*
