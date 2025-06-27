// src/utils/carbonUtils.js

/**
 * Calculate carbon credits based on area, crop type, and practice type
 * This mirrors the smart contract calculation logic
 */
export const calculateCarbonCredits = (area, cropType, practiceType, baseCarbonPerHectare = 1000) => {
  const cropMultipliers = {
    wheat: 100,
    rice: 80,
    pulses: 120,
    maize: 110
  };

  const practiceMultipliers = {
    organic: 130,
    'no-till': 120,
    biochar: 150,
    cover: 140,
    conventional: 100
  };

  const cropMultiplier = cropMultipliers[cropType] || 100;
  const practiceMultiplier = practiceMultipliers[practiceType] || 100;

  const carbonSaved = parseInt(area) * baseCarbonPerHectare * cropMultiplier * practiceMultiplier;
  const tokensToMint = carbonSaved / 10000; // Convert to tokens as per contract logic

  return tokensToMint;
};

/**
 * Format carbon credit balance for display
 */
export const formatCarbonBalance = (balance) => {
  if (!balance) return '0';
  const balanceNumber = parseFloat(balance);
  if (balanceNumber === 0) return '0';
  if (balanceNumber < 0.0001) return '< 0.0001';
  return balanceNumber.toFixed(4);
};

/**
 * Get crop information including multiplier
 */
export const getCropInfo = (cropType) => {
  const crops = {
    wheat: { label: 'Wheat', multiplier: 100, description: 'Standard grain crop' },
    rice: { label: 'Rice', multiplier: 80, description: 'Water-intensive crop' },
    pulses: { label: 'Pulses', multiplier: 120, description: 'Nitrogen-fixing legumes' },
    maize: { label: 'Maize', multiplier: 110, description: 'High-yield grain crop' }
  };
  return crops[cropType] || null;
};

/**
 * Get farming practice information including multiplier
 */
export const getPracticeInfo = (practiceType) => {
  const practices = {
    organic: { label: 'Organic Farming', multiplier: 130, description: 'Chemical-free farming' },
    'no-till': { label: 'No-Till Farming', multiplier: 120, description: 'Soil conservation method' },
    biochar: { label: 'Biochar Application', multiplier: 150, description: 'Carbon sequestration technique' },
    cover: { label: 'Cover Cropping', multiplier: 140, description: 'Soil health improvement' },
    conventional: { label: 'Conventional', multiplier: 100, description: 'Standard farming practices' }
  };
  return practices[practiceType] || null;
};

/**
 * Validate form data for carbon credit calculation
 */
export const validateCarbonCreditForm = (formData) => {
  const errors = {};

  if (!formData.area || isNaN(formData.area) || parseFloat(formData.area) <= 0) {
    errors.area = 'Please enter a valid area greater than 0';
  }

  if (!formData.cropType) {
    errors.cropType = 'Please select a crop type';
  }

  if (!formData.practiceType) {
    errors.practiceType = 'Please select a farming practice';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get environmental impact description based on practice type
 */
export const getEnvironmentalImpact = (practiceType) => {
  const impacts = {
    organic: 'Reduces chemical runoff and improves soil biodiversity',
    'no-till': 'Prevents soil erosion and preserves soil carbon',
    biochar: 'Sequesters carbon long-term and improves soil fertility',
    cover: 'Prevents soil erosion and improves nitrogen cycling',
    conventional: 'Standard environmental impact'
  };
  return impacts[practiceType] || 'Environmental benefits vary';
};