// src/components/WalletConnect.js
import React from 'react'
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

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

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
            onClick={() => disconnect()}
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
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outlined"
              onClick={() => connect({ connector })}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} />
                ) : (
                  <AccountBalanceWallet />
                )
              }
              sx={{ py: 1.5 }}
            >
              {isPending ? 'Connecting...' : `Connect ${connector.name}`}
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
