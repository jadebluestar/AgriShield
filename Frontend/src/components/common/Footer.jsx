import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Insurance', href: '/insurance' },
        { name: 'Lending', href: '/lending' },
        { name: 'Carbon Credits', href: '/carbon' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Contact Us', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press Kit', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Security', href: '#' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a365d',
        color: 'white',
        py: 8,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <img src="/logo.png" alt="AgriShield Logo" style={{ height: 36, width: 36, objectFit: 'contain' }} />
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 0,
                }}
              >
                AgriShield
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                opacity: 0.9,
                lineHeight: 1.7,
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              Empowering farmers worldwide with blockchain-powered financial tools. 
              Weather insurance, cross-chain lending, and carbon credit trading all in one platform.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Email sx={{ mr: 2, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support@agrisheild.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone sx={{ mr: 2, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  San Francisco, CA
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box>
              <IconButton 
                color="inherit" 
                href="https://github.com/jadebluestar/AgriShield" 
                target="_blank"
                sx={{ 
                  mr: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://twitter.com" 
                target="_blank"
                sx={{ 
                  mr: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://linkedin.com" 
                target="_blank"
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <Grid item xs={6} md={2} key={section.title}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1.1rem',
                  fontFamily: '"Manrope", "Inter", sans-serif',
                  mb: 2,
                }}
              >
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    color="inherit"
                    underline="none"
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      opacity: 0.8,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      '&:hover': { 
                        opacity: 1,
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Typography variant="body2">{link.name}</Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              © {currentYear} AgriSheild Global Farmers Market. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
              mt: { xs: 2, md: 0 } 
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                Built with ❤️ for farmers worldwide
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
