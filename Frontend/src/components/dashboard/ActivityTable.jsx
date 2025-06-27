import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  Collapse,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  AccountBalance,
  Security,
  Nature,
  TrendingUp,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const ActivityTable = () => {
  const { activities } = useApp();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'loan':
        return <AccountBalance sx={{ fontSize: 20, color: '#1a365d' }} />;
      case 'insurance':
        return <Security sx={{ fontSize: 20, color: '#1a365d' }} />;
      case 'carbon credits':
        return <Nature sx={{ fontSize: 20, color: '#1a365d' }} />;
      default:
        return <TrendingUp sx={{ fontSize: 20, color: '#1a365d' }} />;
    }
  };

  const formatAmount = (amount, type) => {
    if (type.toLowerCase() === 'carbon credits') {
      return `${amount} Credits`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const displayedActivities = expanded ? activities : activities.slice(0, 5);

  return (
    <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            📊 Recent Activity
          </Typography>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{
              color: '#1a365d',
              '&:hover': { bgcolor: '#f7fafc' }
            }}
          >
            {expanded ? 'Show Less' : 'Show All'}
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a365d' }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a365d' }}>Amount</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#1a365d' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a365d' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedActivities.map((activity) => (
                <TableRow 
                  key={activity.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: '#f7fafc',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getTypeIcon(activity.type)}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1, 
                          fontWeight: 500,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                      >
                        {activity.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                    >
                      {activity.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      {formatAmount(activity.amount, activity.type)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4a5568',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {activities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4a5568',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              No recent activity to display
            </Typography>
          </Box>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 3, p: 3, bgcolor: '#f7fafc', borderRadius: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4a5568',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              Showing all {activities.length} activities. Activities are automatically updated 
              when you interact with AgriChain services.
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ActivityTable;
