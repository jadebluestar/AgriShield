import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
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
  useMediaQuery,
  Divider
} from '@mui/material'
import { 
  Agriculture, 
  AccountBalanceWallet,
  Menu as MenuIcon,
  ExitToApp,
  Person
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearFarmerData } = useAppContext()
  const navigate = useNavigate()
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

  const handleLogout = () => {
    disconnect()
    clearFarmerData()
    localStorage.clear()
    handleWalletMenuClose()
    navigate('/')
  }

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Insurance', path: '/insurance' },
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
        <Box>
           🌾 AgriShield
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
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {chain?.name}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem component={Link} to="/profile" onClick={handleWalletMenuClose}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout & Disconnect
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