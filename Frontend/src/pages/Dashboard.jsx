import React from 'react'
import { useAccount } from 'wagmi'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  Button,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material'
import { 
  Dashboard as DashboardIcon, 
  Agriculture, 
  Security, 
  CloudQueue,
  AccountBalanceWallet,
  TrendingUp,
  Notifications,
  AccessTime
} from '@mui/icons-material'
import WalletConnect from '../components/WalletConnect'
import { useFarmerNFT, useInsurance } from '../hooks/useContracts'
import CarbonBalance from '../components/carbon/CarbonBalance'
import CarbonCalculator from '../components/carbon/CarbonCalculator'
import { useCarbonCredits } from '../hooks/useCarbonCredits'
import { useAppContext } from '../context/AppContext'

const Dashboard = () => {
  const { address, isConnected } = useAccount()
  const { useHasNFT, useTokenCounter } = useFarmerNFT()
  const { 
    useFarmerLocation, 
    useInsurancePeriod, 
    useRainData,
    useInsuranceUsers 
  } = useInsurance()
  
  // App Context - Fixed destructuring
  const {
    farmerData = {},
    stats = {},
    notifications = [],
    activities = [],
    isRegistered,
    updateCarbonBalance,
    updateNftBalance,
    addActivity,
    addNotification,
    setLoading,
    setError,
    loading
  } = useAppContext() || {}
  
  // Create weatherData mock if not provided
  const weatherData = {
    current: {
      temperature: 25,
      condition: 'Partly Cloudy'
    }
  }
  
  // Carbon credits hook
  const {
    carbonBalance,
    totalSupply,
    isBalanceLoading,
    isEligible,
    mintCarbonCredits,
    transactionStatus
  } = useCarbonCredits()
  
  // Get user data with proper error handling
  const { data: nftBalance } = useHasNFT(address)
  const { data: tokenCounter } = useTokenCounter()
  const { data: farmerLocation } = useFarmerLocation(address)
  const { data: insurancePeriod } = useInsurancePeriod(address)
  const { data: rainData } = useRainData(address)
  const { data: allUsers } = useInsuranceUsers()
  
  // Use context data where available, fallback to contract data
  const hasNFT = isRegistered || (nftBalance && Number(nftBalance) > 0)
  const hasInsurance = farmerLocation && farmerLocation !== ''
  // FIXED: Use farmerData directly instead of undefined user object
  const userCarbonBalance = farmerData?.carbonBalance || carbonBalance || 0
  
  // Update context when contract data changes
  React.useEffect(() => {
    if (nftBalance && Number(nftBalance) !== (farmerData?.nftBalance || 0)) {
      updateNftBalance && updateNftBalance(Number(nftBalance))
    }
  }, [nftBalance, farmerData?.nftBalance, updateNftBalance])
  
  React.useEffect(() => {
    if (carbonBalance && carbonBalance !== (farmerData?.carbonBalance || 0)) {
      updateCarbonBalance && updateCarbonBalance(carbonBalance)
    }
  }, [carbonBalance, farmerData?.carbonBalance, updateCarbonBalance])

  // Carbon credits handler with context integration
  const handleCalculateCredits = async (calculationResult) => {
    try {
      setLoading && setLoading(true)
      await mintCarbonCredits(
        calculationResult.formData.area,
        calculationResult.formData.cropType,
        calculationResult.formData.practiceType
      )
      
      // Update context with new carbon balance
      updateCarbonBalance && updateCarbonBalance(calculationResult.creditsEarned || 0)
      
      // Add activity - check if addActivity exists
      if (addActivity) {
        addActivity({
          type: 'Carbon Credits',
          description: `Generated ${calculationResult.creditsEarned || 0} carbon credits`,
          amount: calculationResult.creditsEarned || 0,
          status: 'Completed',
          date: new Date().toLocaleDateString(),
          id: Date.now()
        })
      }
      
      // Add notification - check if addNotification exists
      if (addNotification) {
        addNotification({
          title: 'Carbon Credits Generated!',
          message: `You've earned ${calculationResult.creditsEarned || 0} carbon credits`,
          type: 'success',
          id: Date.now(),
          read: false
        })
      }
      
    } catch (error) {
      console.error('Error minting credits:', error)
      if (setError) {
        setError(error.message)
      }
      if (addNotification) {
        addNotification({
          title: 'Carbon Credits Error',
          message: 'Failed to generate carbon credits. Please try again.',
          type: 'error',
          id: Date.now(),
          read: false
        })
      }
    } finally {
      setLoading && setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Farmer Dashboard
        </Typography>
        <WalletConnect />
      </Container>
    )
  }

  const getDroughtRisk = () => {
    if (!rainData) return { level: 'Unknown', color: 'text.secondary', percentage: 0 }
    
    const recentRain = Array.from(rainData).slice(-7)
    const dryDays = recentRain.filter(day => Number(day) <= 500).length
    
    if (dryDays >= 5) return { level: 'High Risk', color: 'error.main', percentage: 80 }
    if (dryDays >= 3) return { level: 'Medium Risk', color: 'warning.main', percentage: 50 }
    return { level: 'Low Risk', color: 'success.main', percentage: 20 }
  }

  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds === '0' || isNaN(Number(seconds))) return 'N/A'
    const numSeconds = Number(seconds)
    if (numSeconds <= 0) return 'Expired'
    
    const days = Math.floor(numSeconds / (24 * 60 * 60))
    const hours = Math.floor((numSeconds % (24 * 60 * 60)) / (60 * 60))
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? ` ${hours}h` : ''}`
    } else if (hours > 0) {
      const minutes = Math.floor((numSeconds % (60 * 60)) / 60)
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
    } else {
      const minutes = Math.floor(numSeconds / 60)
      return minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : 'Less than 1 minute'
    }
  }

  const getInsuranceStatus = () => {
    if (!hasInsurance) return { status: 'None', color: 'text.secondary', timeRemaining: null }
    
    if (insurancePeriod) {
      const timeRemaining = formatTimeRemaining(insurancePeriod)
      const isExpired = timeRemaining === 'Expired'
      
      return {
        status: isExpired ? 'Expired' : 'Active',
        color: isExpired ? 'error.main' : 'success.main',
        timeRemaining: timeRemaining
      }
    }
    
    return { status: 'Active', color: 'success.main', timeRemaining: null }
  }

  const droughtRisk = getDroughtRisk()
  const insuranceStatus = getInsuranceStatus()
  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4">
              Welcome back, {farmerData?.name || 'Farmer'}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {farmerData?.location && `${farmerData.location} • `}
              Credit Score: {stats?.creditScore || 700}
            </Typography>
          </Box>
        </Box>
        
        {/* Notifications indicator */}
        {unreadNotifications > 0 && (
          <Box display="flex" alignItems="center" gap={1}>
            <Notifications color="action" />
            <Chip 
              label={`${unreadNotifications} new`} 
              size="small" 
              color="primary" 
            />
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Registration Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Agriculture color={hasNFT ? 'success' : 'disabled'} />
                <Typography variant="h6">
                  Registration
                </Typography>
              </Box>
              <Typography variant="h4" color={hasNFT ? 'success.main' : 'text.secondary'}>
                {hasNFT ? 'Active' : 'Pending'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                KYC: {farmerData?.kycStatus || 'Pending'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {farmerData?.registrationDate && 
                  `Joined: ${new Date(farmerData.registrationDate).toLocaleDateString()}`
                }
              </Typography>
              {!hasNFT && (
                <Button size="small" href="/register" sx={{ mt: 1 }}>
                  Register Now
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Insurance Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Security color={hasInsurance ? 'success' : 'disabled'} />
                <Typography variant="h6">
                  Insurance
                </Typography>
              </Box>
              <Typography variant="h4" color={insuranceStatus.color}>
                {insuranceStatus.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hasInsurance ? `Location: ${farmerLocation}` : 'No active coverage'}
              </Typography>
              {insuranceStatus.timeRemaining && (
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <AccessTime sx={{ fontSize: 16 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {insuranceStatus.timeRemaining === 'Expired' ? 'Expired' : `${insuranceStatus.timeRemaining} left`}
                  </Typography>
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" display="block">
                Policies: {stats?.insurancePolicies || 0}
              </Typography>
              {hasNFT && (!hasInsurance || insuranceStatus.status === 'Expired') && (
                <Button size="small" href="/insurance" sx={{ mt: 1 }}>
                  {insuranceStatus.status === 'Expired' ? 'Renew Insurance' : 'Get Insurance'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weather Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CloudQueue color="primary" />
                <Typography variant="h6">
                  Weather
                </Typography>
              </Box>
              <Typography variant="h4" color={droughtRisk.color}>
                {weatherData.current.temperature}°C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {weatherData.current.condition}
              </Typography>
              <Typography variant="caption" color={droughtRisk.color}>
                Risk: {droughtRisk.level}
              </Typography>
              <Box mt={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={droughtRisk.percentage} 
                  color={droughtRisk.level === 'High Risk' ? 'error' : droughtRisk.level === 'Medium Risk' ? 'warning' : 'success'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Value */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp color="primary" />
                <Typography variant="h6">
                  Portfolio
                </Typography>
              </Box>
              <Typography variant="h4" color="primary.main">
                ${(stats?.totalValue || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Loans: {stats?.activeLoans || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Credits Balance */}
        <Grid item xs={12} md={6}>
          <CarbonBalance
            balance={userCarbonBalance}
            totalSupply={totalSupply}
            isLoading={isBalanceLoading}
            showDetails={true}
            contextStats={stats}
          />
        </Grid>

        {/* Carbon Credits Calculator */}
        <Grid item xs={12} md={6}>
          <CarbonCalculator
            onCalculate={handleCalculateCredits}
            disabled={!isEligible || transactionStatus === 'pending'}
            farmerData={farmerData}
          />
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {activities.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  {activities.slice(0, 5).map((activity) => (
                    <Box key={activity.id} display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {activity.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.description} • {activity.date}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        {activity.amount > 0 && (
                          <Typography variant="body2" color="success.main">
                            +{activity.amount}
                          </Typography>
                        )}
                        <Chip 
                          label={activity.status} 
                          size="small" 
                          color={activity.status === 'Completed' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent activities
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Platform Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Statistics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total Farmers:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {tokenCounter ? Number(tokenCounter) : 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Insured Farmers:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {allUsers ? allUsers.length : 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">My Carbon Credits:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {userCarbonBalance || 0} CC
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Credit Score:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={
                      (stats?.creditScore || 700) >= 700 ? 'success.main' : 
                      (stats?.creditScore || 700) >= 650 ? 'warning.main' : 'error.main'
                    }
                  >
                    {stats?.creditScore || 700}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Your Address:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {!hasNFT && (
                  <Button variant="contained" href="/register">
                    Complete Registration
                  </Button>
                )}
                {hasNFT && (!hasInsurance || insuranceStatus.status === 'Expired') && (
                  <Button variant="contained" href="/insurance">
                    {insuranceStatus.status === 'Expired' ? 'Renew Insurance Coverage' : 'Get Insurance Coverage'}
                  </Button>
                )}
                {hasInsurance && insuranceStatus.status === 'Active' && (
                  <Button variant="outlined" href="/profile">
                    View Profile
                  </Button>
                )}
                <Button variant="outlined" href="/lending">
                  Explore Lending
                </Button>
                <Button 
                  variant="outlined" 
                  href="/carbon"
                  disabled={transactionStatus === 'pending'}
                >
                  {transactionStatus === 'pending' ? 'Processing...' : 'Carbon Credits'}
                </Button>
                {activities.length > 5 && (
                  <Button variant="outlined" href="/activities">
                    View All Activities
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard