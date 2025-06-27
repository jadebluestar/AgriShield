import React, { useState } from 'react'
import { useAccount } from 'wagmi'
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
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Security, CloudQueue, TrendingUp } from '@mui/icons-material'
import WalletConnect from '../components/WalletConnect'
import { useFarmerNFT, useInsurance, useTransactionStatus } from '../hooks/useContracts'

const Insurance = () => {
  const { address, isConnected } = useAccount()
  const { useHasNFT } = useFarmerNFT()
  const { 
    getInsurance, 
    useFarmerLocation, 
    useInsurancePeriod,
    useRainData,
    insuranceHash, 
    insuranceError, 
    insurancePending 
  } = useInsurance()
  const { data: txReceipt, isLoading: txLoading } = useTransactionStatus(insuranceHash)
  
  // Check if user has NFT
  const { data: nftBalance } = useHasNFT(address)
  const hasNFT = nftBalance && Number(nftBalance) > 0

  // Get user's insurance info
  const { data: currentLocation } = useFarmerLocation(address)
  const { data: insurancePeriod } = useInsurancePeriod(address)
  const { data: rainData } = useRainData(address)

  const [insuranceAmount, setInsuranceAmount] = useState(0.001)
  const [location, setLocation] = useState('')

  const hasActiveInsurance = currentLocation && currentLocation !== ''

  const calculateCoverage = (amount) => {
    // Based on your contract: coverage period = (365 days * 0.001 ether) / amount funded
    const basePeriod = 365 // days
    const baseAmount = 0.001 // ether
    return Math.floor((basePeriod * baseAmount) / amount)
  }

  const handleGetInsurance = async (e) => {
    e.preventDefault()
    
    if (!hasNFT) {
      alert('You need to register as a farmer first!')
      return
    }

    if (!location.trim()) {
      alert('Please enter your location')
      return
    }

    try {
      await getInsurance(location, insuranceAmount)
    } catch (error) {
      console.error('Insurance purchase failed:', error)
    }
  }

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Weather Insurance
        </Typography>
        <WalletConnect />
      </Container>
    )
  }

  if (!hasNFT) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ maxWidth: 500, margin: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Security sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Registration Required
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You need to register as a farmer first to access insurance services.
            </Typography>
            <Button 
              variant="contained" 
              href="/register" 
              sx={{ mt: 3 }}
            >
              Register Now
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Weather-Based Crop Insurance
      </Typography>
      
      <Grid container spacing={4}>
        {/* Insurance Purchase Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', height: 'fit-content' }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <CloudQueue color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5">
                Get Insurance Coverage
              </Typography>
            </Box>

            {hasActiveInsurance ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                You have active insurance for: {currentLocation}
              </Alert>
            ) : (
              <form onSubmit={handleGetInsurance}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Farm Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    fullWidth
                    helperText="Enter your city name for weather tracking (e.g., 'Mumbai', 'Delhi')"
                  />
                  
                  <Box>
                    <Typography gutterBottom>
                      Insurance Amount: {insuranceAmount} ETH
                    </Typography>
                    <Slider
                      value={insuranceAmount}
                      onChange={(e, newValue) => setInsuranceAmount(newValue)}
                      min={0.001}
                      max={0.1}
                      step={0.001}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value} ETH`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Coverage Period: {calculateCoverage(insuranceAmount)} days
                    </Typography>
                  </Box>

                  <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        How it works:
                      </Typography>
                      <Typography variant="body2" component="div">
                        • Automated weather monitoring using Chainlink oracles
                        <br />
                        • If no significant rain (&gt;5mm) for 7 consecutive days, you get 0.005 ETH payout
                        <br />
                        • Coverage amount: {insuranceAmount} ETH
                        <br />
                        • Coverage period: {calculateCoverage(insuranceAmount)} days
                      </Typography>
                    </CardContent>
                  </Card>

                  {insuranceError && (
                    <Alert severity="error">
                      Insurance purchase failed: {insuranceError.message}
                    </Alert>
                  )}

                  {insuranceHash && !txReceipt && (
                    <Alert severity="info">
                      Transaction submitted! Waiting for confirmation...
                      <br />
                      Hash: {insuranceHash}
                    </Alert>
                  )}

                  {txReceipt && (
                    <Alert severity="success">
                      Insurance purchased successfully! Weather monitoring has started.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={insurancePending || txLoading}
                  >
                    {insurancePending || txLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Processing...
                      </>
                    ) : (
                      `Purchase Insurance (${insuranceAmount} ETH)`
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Paper>
        </Grid>

        {/* Insurance Status Dashboard */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0' }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <TrendingUp color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5">
                Insurance Status
              </Typography>
            </Box>

            {hasActiveInsurance ? (
              <Box display="flex" flexDirection="column" gap={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Coverage Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {currentLocation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Period: {insurancePeriod ? Number(insurancePeriod) : 0} seconds remaining
                    </Typography>
                  </CardContent>
                </Card>

                {rainData && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Weather Data (Last 7 days)
                      </Typography>
                      {Array.from(rainData).map((rainfall, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" py={0.5}>
                          <Typography variant="body2">
                            Day {index + 1}:
                          </Typography>
                          <Typography variant="body2" color={Number(rainfall) > 500 ? 'success.main' : 'warning.main'}>
                            {Number(rainfall) / 100}mm {Number(rainfall) === 0 ? '(No data)' : ''}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Alert severity="info">
                  Weather monitoring is active. If drought conditions are detected 
                  (less than 5mm rain for 7 consecutive days), you will automatically 
                  receive a payout of 0.005 ETH.
                </Alert>
              </Box>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CloudQueue sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No Active Insurance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Purchase insurance to start weather monitoring
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Insurance