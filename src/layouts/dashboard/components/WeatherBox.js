import React, { useEffect, useState } from 'react';
import { Card, CircularProgress, IconButton, Tooltip } from '@mui/material';
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

const apiKey = (process.env.REACT_APP_OPENWEATHER_API_KEY || '').trim();
console.log('WeatherBox: apiKey present =', Boolean(apiKey));

export default function WeatherBox({ city: propCity = 'New York' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(propCity);
  const [unit, setUnit] = useState('C');

  useEffect(() => {
    // load saved unit preference
    try {
      const saved = localStorage.getItem('weather_unit');
      if (saved === 'C' || saved === 'F') setUnit(saved);
    } catch (e) {}

    // Try to get user's location
    if (!apiKey) {
      // No key configured; show friendly message
      setLoading(false);
      setWeather({ cod: 401, message: 'Missing OpenWeather API key' });
      return;
    }
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
  let tempC = null;
  let cityName = city;
  let feelsLikeC = null;
  let humidity = '';
  let wind = '';
  let error = false;
  if (weather && weather.weather && weather.weather[0] && weather.main && weather.wind) {
    main = weather.weather[0].main;
    icon = weatherIcons[main] || weatherIcons.Default;
    tempC = weather.main.temp !== undefined ? Math.round(weather.main.temp) : null;
    // Only show the last word (usually the city) if the name is long
    if (weather.name && weather.name.includes(' ')) {
      const parts = weather.name.split(' ');
      cityName = parts[parts.length - 1];
    } else {
      cityName = weather.name;
    }
    feelsLikeC = weather.main.feels_like !== undefined ? Math.round(weather.main.feels_like) : null;
    humidity = weather.main.humidity;
    wind = Math.round(weather.wind.speed);
  } else if (weather && weather.cod && weather.cod !== 200) {
    error = true;
  }

  const convertCtoF = (c) => Math.round((c * 9) / 5 + 32);
  const tempDisplay = tempC !== null && !isNaN(tempC) ? (unit === 'C' ? tempC : convertCtoF(tempC)) : null;
  const feelsLikeDisplay = feelsLikeC !== null && !isNaN(feelsLikeC) ? (unit === 'C' ? feelsLikeC : convertCtoF(feelsLikeC)) : null;

  return (
    <Card sx={{
      position: 'relative',
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
      {/* Unit toggle button (styled to match UI) */}
      <Tooltip title={unit === 'C' ? 'Switch to °F' : 'Switch to °C'}>
        <IconButton
          aria-label={unit === 'C' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          size="small"
          onClick={() => {
            const next = unit === 'C' ? 'F' : 'C';
            setUnit(next);
            try { localStorage.setItem('weather_unit', next); } catch (e) {}
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            lineHeight: 1,
            transition: 'background-color 150ms, transform 120ms',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', transform: 'scale(1.03)' }
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 12 }}>{unit === 'C' ? '°C' : '°F'}</span>
        </IconButton>
      </Tooltip>

      {loading ? (
        <CircularProgress color="info" />
      ) : error ? (
        <VuiBox textAlign="center">
          <VuiTypography color="error" variant="button" fontWeight="bold" mb={0.5}>
            Unable to fetch weather data.
          </VuiTypography>
          {(!apiKey || weather?.cod === 401) && (
            <VuiTypography color="text" variant="caption">
              Check REACT_APP_OPENWEATHER_API_KEY in your environment.
            </VuiTypography>
          )}
        </VuiBox>
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
            {tempDisplay !== null && !isNaN(tempDisplay) ? `${tempDisplay}°${unit}` : '--'}
          </VuiTypography>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb={1} sx={{ fontSize: 18, textTransform: 'capitalize' }}>
            {main || '-'}  
          </VuiTypography>
          <VuiBox display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap={{ xs: 1.5, md: 2 }} mt={1} sx={{ width: '100%' }}>
            <VuiTypography color="text" variant="caption" fontWeight="regular" sx={{ fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                Feels like: <span style={{ color: '#fff', fontWeight: 600 }}>{feelsLikeDisplay !== null && !isNaN(feelsLikeDisplay) ? `${feelsLikeDisplay}°${unit}` : '--'}</span>
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
