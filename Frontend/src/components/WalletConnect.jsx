// src/components/WalletConnect.js
import React, { useCallback, useEffect, useRef } from 'react'
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
import { AccountBalanceWallet, ExitToApp } from '@mui/icons-material'

const WalletConnect = () => {
  const { address, isConnected, connector, chain } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connectionAttemptRef = useRef(false)
  const isDev = process.env.NODE_ENV === 'development'
  const isVercel = process.env.VERCEL === '1'

const connectionDelay = isDev ? 100 : 500


  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  // Reset connection attempt flag when connection state changes
  useEffect(() => {
    if (isConnected || error) {
      connectionAttemptRef.current = false
    }
  }, [isConnected, error])

  const handleConnect = useCallback(async (selectedConnector) => {
    // Prevent multiple concurrent connection attempts
    if (connectionAttemptRef.current || isPending) {
      return
    }

    try {
      connectionAttemptRef.current = true
      
      // Add a small delay to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, connectionDelay))
      
      await connect({ connector: selectedConnector })
    } catch (err) {
      console.error('Connection error:', err)
      connectionAttemptRef.current = false
    }
  }, [connect, connectionDelay, isPending])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      connectionAttemptRef.current = false
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }, [disconnect])

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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
            {error.message.includes('already pending') && (
              <Typography variant="caption" display="block" mt={1}>
                Please wait a moment and try again, or refresh the page.
              </Typography>
            )}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outlined"
              onClick={() => handleConnect(connector)}
              disabled={isPending || connectionAttemptRef.current}
              startIcon={
                isPending || connectionAttemptRef.current ? (
                  <CircularProgress size={20} />
                ) : (
                  <AccountBalanceWallet />
                )
              }
              sx={{ py: 1.5 }}
            >
              {isPending || connectionAttemptRef.current 
                ? 'Connecting...' 
                : `Connect ${connector.name}`
              }
            </Button>
          ))}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Make sure you have MetaMask or a compatible wallet installed.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default WalletConnect