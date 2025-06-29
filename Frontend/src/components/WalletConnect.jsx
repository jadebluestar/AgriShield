// src/components/WalletConnect.js - Improved version
import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import { AccountBalanceWallet, ExitToApp, Refresh } from '@mui/icons-material'

const WalletConnect = () => {
  const { address, isConnected, connector, chain } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [connectionTimeout, setConnectionTimeout] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Clear any pending MetaMask requests on mount
  useEffect(() => {
    // Clear any existing pending requests when component mounts
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('🧹 Clearing any pending MetaMask requests')
    }
  }, [])

  // Connection timeout handler
  useEffect(() => {
    let timeoutId
    
    if (isPending) {
      console.log('🔄 Connection attempt started')
      setConnectionTimeout(false)
      
      // Set 10 second timeout for connection
      timeoutId = setTimeout(() => {
        console.log('⏰ Connection timeout reached')
        setConnectionTimeout(true)
      }, 10000)
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isPending])

  // Reset timeout when connection succeeds
  useEffect(() => {
    if (isConnected) {
      console.log('✅ Successfully connected to wallet')
      setConnectionTimeout(false)
      setRetryCount(0)
    }
  }, [isConnected])

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  const handleConnect = async (connector) => {
    // Prevent multiple connection attempts
    if (isPending) {
      console.log('⚠️ Connection already in progress, skipping...')
      return
    }
    
    try {
      console.log('🔗 Attempting to connect with:', connector.name)
      setRetryCount(prev => prev + 1)
      await connect({ connector })
    } catch (err) {
      console.error('❌ Connection failed:', err)
      setConnectionTimeout(false)
    }
  }

  const handleDisconnect = () => {
    console.log('🔌 Disconnecting wallet')
    disconnect()
    setConnectionTimeout(false)
    setRetryCount(0)
  }

  const handleRetry = () => {
    // Clear any pending MetaMask requests first
    if (window.ethereum) {
      // Force clear any pending requests
      window.ethereum._metamask?.isUnlocked?.().then(() => {
        console.log('🔄 Retrying connection after clearing pending requests')
        setConnectionTimeout(false)
        if (connectors.length > 0) {
          handleConnect(connectors[0])
        }
      }).catch(() => {
        console.log('🔄 Retrying connection')
        setConnectionTimeout(false)
        if (connectors.length > 0) {
          handleConnect(connectors[0])
        }
      })
    } else {
      console.log('🔄 Retrying connection')
      setConnectionTimeout(false)
      if (connectors.length > 0) {
        handleConnect(connectors[0])
      }
    }
  }

  // Connected state
  if (isConnected) {
    return (
      <Card sx={{ maxWidth: 400, margin: 'auto', mt: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceWallet sx={{ fontSize: 40, color: 'success.main' }} />
          <Box flex={1}>
            <Typography variant="h6">Wallet Connected</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatAddress(address)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Network: {chain?.name || 'Unknown'}
            </Typography>
            {connector && (
              <Chip
                label={`Via: ${connector.name}`}
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDisconnect}
            startIcon={<ExitToApp />}
            size="small"
          >
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Connection state
  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 3 }}>
      <CardContent>
        <Box textAlign="center" mb={2}>
          <AccountBalanceWallet sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Connect Your Wallet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect your wallet to access all features
          </Typography>
        </Box>

        {/* Connection Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {error.message || 'Failed to connect wallet'}
            </Typography>
            {retryCount > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Retry attempt: {retryCount}/3
              </Typography>
            )}
          </Alert>
        )}

        {/* Connection Timeout */}
        {connectionTimeout && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Connection is taking longer than expected. 
              Please check your wallet and try again.
            </Typography>
            <Button
              size="small"
              onClick={handleRetry}
              startIcon={<Refresh />}
              sx={{ mt: 1 }}
            >
              Retry Connection
            </Button>
          </Alert>
        )}

        {/* Connector Buttons */}
        <Box display="flex" flexDirection="column" gap={2}>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outlined"
              onClick={() => handleConnect(connector)}
              disabled={isPending && !connectionTimeout}
              startIcon={
                isPending && !connectionTimeout ? (
                  <CircularProgress size={20} />
                ) : (
                  <AccountBalanceWallet />
                )
              }
              sx={{ py: 1.5 }}
            >
              {isPending && !connectionTimeout
                ? 'Connecting...'
                : `Connect ${connector.name}`}
            </Button>
          ))}
        </Box>

        {/* No connectors available */}
        {connectors.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              No wallet connectors available. Please install MetaMask or another compatible wallet.
            </Typography>
          </Alert>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Make sure you have MetaMask or a compatible wallet installed.
        </Typography>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Debug: {connectors.length} connectors available, 
              isPending: {isPending.toString()}, 
              timeout: {connectionTimeout.toString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default WalletConnect