import React, { useEffect, useState } from 'react';
import { Card, CircularProgress } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const weatherIcons = {
  Clear: <WiDaySunny size={56} color="#FFD600" />,
  Clouds: <WiCloudy size={56} color="#90A4AE" />,
  Rain: <WiRain size={56} color="rgba(33,150,243,0.5)" />,
  Drizzle: <WiRain size={56} color="#4FC3F7" />,
  Snow: <WiSnow size={56} color="#90CAF9" />,
  Thunderstorm: <WiThunderstorm size={56} color="#FFD600" />,
  Default: <WiDaySunny size={56} color="#FFD600" />
};

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
console.log('WeatherBox: apiKey =', apiKey);

export default function WeatherBox({ city: propCity = 'New York' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(propCity);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityByCoords(latitude, longitude);
        },
        () => {
          // If user denies or error, fallback to default city
          fetchWeatherByCity(propCity);
        }
      );
    } else {
      fetchWeatherByCity(propCity);
    }
    // eslint-disable-next-line
  }, []);

  const fetchCityByCoords = (lat, lon) => {
    // Use OpenWeatherMap reverse geocoding to get city name
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    console.log('WeatherBox: fetchCityByCoords url =', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('WeatherBox: fetchCityByCoords response =', data);
        if (data && data[0] && data[0].name) {
          setCity(data[0].name);
          fetchWeatherByCity(data[0].name);
        } else {
          fetchWeatherByCity(propCity);
        }
      })
      .catch((err) => {
        console.error('WeatherBox: fetchCityByCoords error:', err);
        fetchWeatherByCity(propCity);
      });
  };

  const fetchWeatherByCity = (cityName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    console.log('WeatherBox: fetchWeatherByCity url =', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('WeatherBox: fetchWeatherByCity response =', data);
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('WeatherBox: fetchWeatherByCity error:', err);
        setLoading(false);
      });
  };

  let icon = weatherIcons.Default;
  let main = '';
  let temp = '';
  let cityName = city;
  let feelsLike = '';
  let humidity = '';
  let wind = '';
  let error = false;
  if (weather && weather.weather && weather.weather[0] && weather.main && weather.wind) {
    main = weather.weather[0].main;
    icon = weatherIcons[main] || weatherIcons.Default;
    temp = Math.round(weather.main.temp);
    // Only show the last word (usually the city) if the name is long
    if (weather.name && weather.name.includes(' ')) {
      const parts = weather.name.split(' ');
      cityName = parts[parts.length - 1];
    } else {
      cityName = weather.name;
    }
    feelsLike = Math.round(weather.main.feels_like);
    humidity = weather.main.humidity;
    wind = Math.round(weather.wind.speed);
  } else if (weather && weather.cod && weather.cod !== 200) {
    error = true;
  }

  return (
    <Card sx={{
      // Fill the grid cell gracefully and keep a good minimum height
      height: { xs: 300, sm: 320, md: 340 },
      minWidth: 220,
      width: '100%',
      background: 'rgba(34,35,75,0.92)',
      borderRadius: 3,
      p: { xs: 2.25, md: 3 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // Even vertical spacing between content blocks regardless of height
      justifyContent: 'space-between',
      boxShadow: '0 4px 24px 0 rgba(34,35,75,0.12)'
    }}>
      {loading ? (
        <CircularProgress color="info" />
      ) : error ? (
        <VuiTypography color="error" variant="button" fontWeight="bold">
          Unable to fetch weather data.
        </VuiTypography>
      ) : (
        <>
          <VuiTypography variant="lg" color="white" fontWeight="bold" mb="4px" sx={{ letterSpacing: 0.5 }}>
            Weather
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular" mb="8px" sx={{ fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: '80%', md: 180 }, textAlign: 'center' }}>
            {cityName || '-'}
          </VuiTypography>
          <VuiBox sx={{ alignSelf: 'center', my: 0.5 }}>
            {icon}
          </VuiBox>
          <VuiTypography color="white" variant="h1" fontWeight="bold" mb={0} sx={{ fontSize: { xs: 44, md: 56 }, lineHeight: 1, letterSpacing: -2 }}>
            {temp !== '' && !isNaN(temp) ? temp : '--'}
          </VuiTypography>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb={1} sx={{ fontSize: 18, textTransform: 'capitalize' }}>
            {main || '-'}  
          </VuiTypography>
          <VuiBox display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap={{ xs: 1.5, md: 2 }} mt={1} sx={{ width: '100%' }}>
            <VuiTypography color="text" variant="caption" fontWeight="regular" sx={{ fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              Feels like: <span style={{ color: '#fff', fontWeight: 600 }}>{feelsLike !== '' && !isNaN(feelsLike) ? `${feelsLike}°C` : '--'}</span>
            </VuiTypography>
            <VuiTypography color="text" variant="caption" fontWeight="regular" sx={{ fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              Humidity: <span style={{ color: '#fff', fontWeight: 600 }}>{humidity !== '' && !isNaN(humidity) ? `${humidity}%` : '--'}</span>
            </VuiTypography>
            <VuiTypography color="text" variant="caption" fontWeight="regular" sx={{ fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              Wind:
              <span style={{ color: '#fff', fontWeight: 600 }}>{wind !== '' && !isNaN(wind) ? `${wind} m/s` : '--'}</span>
            </VuiTypography>
          </VuiBox>
        </>
      )}
    </Card>
  );
}
