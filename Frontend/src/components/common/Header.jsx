import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Agriculture, 
  AccountBalanceWallet,
  Menu as MenuIcon,
  ExitToApp
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [walletMenuAnchor, setWalletMenuAnchor] = useState(null)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleWalletMenuClick = (event) => {
    setWalletMenuAnchor(event.currentTarget)
  }

  const handleWalletMenuClose = () => {
    setWalletMenuAnchor(null)
  }

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Insurance', path: '/insurance' },
    { label: 'Lending', path: '/lending' },
    { label: 'Carbon Credits', path: '/carbon' },
    { label: 'Profile', path: '/profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <AppBar position="static" elevation={0} sx={{ 
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      color: 'text.primary'
    }}>
      <Toolbar>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: isMobile ? 1 : 0 }}>
          <img src="/logo.png" alt="AgriShield Logo" style={{ height: 32, width: 32, objectFit: 'contain' }} />
          <Typography variant="h6" component={Link} to="/" sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}>
            AgriShield
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box display="flex" gap={2} sx={{ flexGrow: 1, ml: 4 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Wallet Connection */}
        <Box display="flex" alignItems="center" gap={2}>
          {isConnected ? (
            <>
              <Chip
                icon={<AccountBalanceWallet />}
                label={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                onClick={handleWalletMenuClick}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              />
              <Menu
                anchorEl={walletMenuAnchor}
                open={Boolean(walletMenuAnchor)}
                onClose={handleWalletMenuClose}
              >
                <MenuItem onClick={handleWalletMenuClose} disabled>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {chain?.name}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    disconnect()
                    handleWalletMenuClose()
                  }}
                >
                  <ExitToApp sx={{ mr: 1 }} />
                  Disconnect
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<AccountBalanceWallet />}
              component={Link}
              to="/register"
            >
              Connect Wallet
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMenuClose}
              selected={isActive(item.path)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header