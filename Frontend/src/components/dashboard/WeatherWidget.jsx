import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { 
  WbSunny, 
  Cloud, 
  Grain,
  Air,
  Opacity,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const WeatherWidget = ({ location }) => {
  const { weatherData } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <WbSunny sx={{ fontSize: 48, color: '#f59e0b' }} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud sx={{ fontSize: 48, color: '#6b7280' }} />;
      case 'rainy':
        return <Grain sx={{ fontSize: 48, color: '#3b82f6' }} />;
      default:
        return <WbSunny sx={{ fontSize: 48, color: '#f59e0b' }} />;
    }
  };

  const getRainColor = (rainChance) => {
    if (rainChance >= 70) return '#dc2626';
    if (rainChance >= 40) return '#f59e0b';
    return '#059669';
  };

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontWeight: 600,
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            🌤️ Weather Forecast
          </Typography>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
            }}
          >
            Loading weather data for {location}...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      height: '100%',
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
    }}>
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            fontFamily: '"Manrope", "Inter", sans-serif',
            mb: 3,
          }}
        >
          🌤️ Weather Forecast
          <Chip 
            label={location} 
            size="small" 
            sx={{ 
              ml: 2, 
              bgcolor: '#f0f9ff', 
              color: '#1a365d',
              border: '1px solid #bfdbfe',
            }} 
          />
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {getWeatherIcon(weatherData.current.condition)}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#1a365d',
              fontFamily: '"Manrope", "Inter", sans-serif',
              mt: 1,
            }}
          >
            {weatherData.current.temperature}°C
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4a5568',
              fontFamily: '"Inter", "Roboto", sans-serif',
            }}
          >
            {weatherData.current.condition}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Opacity sx={{ mr: 1, color: '#1a365d' }} />
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Humidity
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1a365d',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {weatherData.current.humidity}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Air sx={{ mr: 1, color: '#1a365d' }} />
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Wind
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1a365d',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {weatherData.current.windSpeed} km/h
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            fontFamily: '"Manrope", "Inter", sans-serif',
          }}
        >
          3-Day Forecast
        </Typography>
        
        {weatherData.forecast.map((day, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              py: 2,
              borderBottom: index < weatherData.forecast.length - 1 ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                minWidth: 80,
                fontWeight: 500,
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              {day.day}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mx: 2 }}>
              {getWeatherIcon(day.condition)}
              <Box sx={{ ml: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1a365d',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {day.high}°/{day.low}°
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  {day.condition}
                </Typography>
              </Box>
            </Box>
            
            <Chip
              label={`${day.rain}%`}
              size="small"
              sx={{
                bgcolor: `${getRainColor(day.rain)}20`,
                color: getRainColor(day.rain),
                minWidth: 50,
                fontWeight: 600,
              }}
            />
          </Box>
        ))}

        {weatherData.forecast.some(day => day.rain > 70) && (
          <Box 
            sx={{ 
              mt: 3, 
              p: 3, 
              bgcolor: '#fef3c7', 
              borderRadius: 2,
              border: '1px solid #f59e0b',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: '#92400e',
                fontFamily: '"Inter", "Roboto", sans-serif',
                mb: 1,
              }}
            >
              ⚠️ Heavy Rain Alert
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#92400e',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              High chance of rain in the next 3 days. Consider insurance coverage[3].
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
