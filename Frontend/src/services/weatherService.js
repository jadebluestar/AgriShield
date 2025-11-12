// Weather Service to fetch real weather data
// Using OpenWeatherMap API (free tier)

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather data for a location
 * @param {string} location - City name or coordinates
 * @returns {Promise<Object>} Weather data
 */
export const fetchCurrentWeather = async (location) => {
  try {
    // If no API key, return mock data
    if (WEATHER_API_KEY === 'demo') {
      console.warn('No weather API key found, using mock data');
      return getMockWeatherData(location);
    }

    const url = `${WEATHER_API_BASE}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return getMockWeatherData(location);
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      precipitation: data.rain?.['1h'] || 0,
      icon: data.weather[0].icon,
      timestamp: new Date(data.dt * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getMockWeatherData(location);
  }
};

/**
 * Fetch weather forecast for next 5 days
 * @param {string} location - City name
 * @returns {Promise<Array>} Forecast data
 */
export const fetchWeatherForecast = async (location) => {
  try {
    if (WEATHER_API_KEY === 'demo') {
      return getMockForecastData(location);
    }

    const url = `${WEATHER_API_BASE}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return getMockForecastData(location);
    }
    
    const data = await response.json();
    
    // Group by day and get daily averages
    const dailyData = {};
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temps: [],
          conditions: [],
          precipitation: 0,
        };
      }
      
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main);
      dailyData[date].precipitation += (item.rain?.['3h'] || 0);
    });
    
    // Convert to array and calculate averages
    return Object.values(dailyData).slice(0, 5).map((day) => ({
      date: day.date,
      avgTemp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
      condition: day.conditions[0],
      precipitation: Math.round(day.precipitation * 10) / 10,
    }));
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return getMockForecastData(location);
  }
};

/**
 * Get drought risk assessment
 * @param {string} location - City name
 * @returns {Promise<Object>} Risk assessment
 */
export const getDroughtRisk = async (location) => {
  try {
    const forecast = await fetchWeatherForecast(location);
    
    // Calculate total precipitation for next 5 days
    const totalPrecip = forecast.reduce((sum, day) => sum + day.precipitation, 0);
    
    // Calculate average temperature
    const avgTemp = forecast.reduce((sum, day) => sum + day.avgTemp, 0) / forecast.length;
    
    // Simple drought risk assessment
    let risk = 'Low';
    let percentage = 20;
    let color = 'success.main';
    
    if (totalPrecip < 5 && avgTemp > 30) {
      risk = 'High';
      percentage = 80;
      color = 'error.main';
    } else if (totalPrecip < 10 && avgTemp > 25) {
      risk = 'Medium';
      percentage = 50;
      color = 'warning.main';
    }
    
    return {
      level: risk,
      percentage,
      color,
      totalPrecipitation: totalPrecip,
      avgTemperature: Math.round(avgTemp),
      recommendation: getRiskRecommendation(risk),
    };
  } catch (error) {
    console.error('Error calculating drought risk:', error);
    return {
      level: 'Unknown',
      percentage: 0,
      color: 'text.secondary',
      recommendation: 'Unable to assess risk at this time',
    };
  }
};

/**
 * Get risk recommendation message
 * @param {string} risk - Risk level
 * @returns {string} Recommendation
 */
const getRiskRecommendation = (risk) => {
  switch (risk) {
    case 'High':
      return 'Consider irrigation and water conservation. Insurance claim may be triggered.';
    case 'Medium':
      return 'Monitor water levels. Prepare irrigation if needed.';
    case 'Low':
      return 'Weather conditions are favorable for crops.';
    default:
      return 'Continue normal farming operations.';
  }
};

/**
 * Mock weather data for testing
 * @param {string} location - Location name
 * @returns {Object} Mock weather data
 */
const getMockWeatherData = (location) => {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Sunny'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    location: location || 'Unknown Location',
    temperature: Math.round(Math.random() * 20 + 15), // 15-35°C
    feelsLike: Math.round(Math.random() * 20 + 15),
    humidity: Math.round(Math.random() * 40 + 40), // 40-80%
    condition: randomCondition,
    description: randomCondition.toLowerCase(),
    windSpeed: Math.round(Math.random() * 30 + 5), // 5-35 km/h
    pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
    precipitation: Math.round(Math.random() * 10 * 10) / 10, // 0-10mm
    icon: '01d',
    timestamp: new Date().toISOString(),
    isMock: true,
  };
};

/**
 * Mock forecast data
 * @param {string} location - Location name
 * @returns {Array} Mock forecast
 */
const getMockForecastData = (location) => {
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toLocaleDateString(),
      avgTemp: Math.round(Math.random() * 15 + 20),
      maxTemp: Math.round(Math.random() * 10 + 30),
      minTemp: Math.round(Math.random() * 10 + 15),
      condition: ['Clear', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)],
      precipitation: Math.round(Math.random() * 10 * 10) / 10,
    };
  });
};

export default {
  fetchCurrentWeather,
  fetchWeatherForecast,
  getDroughtRisk,
};
