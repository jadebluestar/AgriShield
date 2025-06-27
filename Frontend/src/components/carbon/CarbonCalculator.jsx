// src/components/carbon/CarbonCalculator.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import { Calculator, Leaf, TrendingUp } from 'lucide-react';
import { calculateCarbonCredits, validateCarbonCreditForm, getCropInfo, getPracticeInfo } from '../../utils/carbonUtils';

const CarbonCalculator = ({ onCalculate, disabled = false }) => {
  const [formData, setFormData] = useState({
    area: '',
    cropType: '',
    practiceType: ''
  });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const cropTypes = [
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'maize', label: 'Maize' }
  ];

  const practiceTypes = [
    { value: 'organic', label: 'Organic Farming' },
    { value: 'no-till', label: 'No-Till Farming' },
    { value: 'biochar', label: 'Biochar Application' },
    { value: 'cover', label: 'Cover Cropping' },
    { value: 'conventional', label: 'Conventional' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCalculate = () => {
    const validation = validateCarbonCreditForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const tokens = calculateCarbonCredits(formData.area, formData.cropType, formData.practiceType);
    const calculationResult = {
      tokens: tokens,
      formData: { ...formData },
      cropInfo: getCropInfo(formData.cropType),
      practiceInfo: getPracticeInfo(formData.practiceType)
    };

    setResult(calculationResult);
    
    if (onCalculate) {
      onCalculate(calculationResult);
    }
  };

  const handleReset = () => {
    setFormData({
      area: '',
      cropType: '',
      practiceType: ''
    });
    setResult(null);
    setErrors({});
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calculator size={20} />
          Carbon Credit Calculator
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farm Area (hectares)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
                error={!!errors.area}
                helperText={errors.area}
                placeholder="Enter area in hectares"
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Crop Type"
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                error={!!errors.cropType}
                helperText={errors.cropType}
                disabled={disabled}
              >
                {cropTypes.map((crop) => {
                  const cropInfo = getCropInfo(crop.value);
                  return (
                    <MenuItem key={crop.value} value={crop.value}>
                      {crop.label} {cropInfo && `(${cropInfo.multiplier}%)`}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Farming Practice"
                name="practiceType"
                value={formData.practiceType}
                onChange={handleInputChange}
                error={!!errors.practiceType}
                helperText={errors.practiceType}
                disabled={disabled}
              >
                {practiceTypes.map((practice) => {
                  const practiceInfo = getPracticeInfo(practice.value);
                  return (
                    <MenuItem key={practice.value} value={practice.value}>
                      {practice.label} {practiceInfo && `(${practiceInfo.multiplier}%)`}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={disabled || !formData.area || !formData.cropType || !formData.practiceType}
                  sx={{ flex: 1 }}
                >
                  Calculate Credits
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={disabled}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>

          {result && (
            <Paper sx={{ mt: 3, p: 2, bgcolor: 'primary.50' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Leaf size={20} />
                Calculation Result
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  label={`${result.tokens.toFixed(4)} CCT`}
                  color="primary"
                  size="large"
                  sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Carbon Credit Tokens
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Area</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {result.formData.area} hectares
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Crop</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {result.cropInfo?.label} ({result.cropInfo?.multiplier}%)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Practice</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {result.practiceInfo?.label} ({result.practiceInfo?.multiplier}%)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;