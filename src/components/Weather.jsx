import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import SearchBar from './SearchBar'
import WeatherCard from './WeatherCard'
import { AlertCircle } from 'lucide-react'

// Realistic fallback generator when API key is unconfigured or rate-limited
const generateDemoWeather = (cityName, unit) => {
  const isImperial = unit === 'imperial'
  const baseTempC = 22
  const temp = isImperial ? Math.round((baseTempC * 9) / 5 + 32) : baseTempC
  const now = Math.floor(Date.now() / 1000)

  return {
    name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    dt: now,
    timezone: 0,
    sys: {
      country: cityName.toLowerCase() === 'london' ? 'GB' : '',
      sunrise: now - 21600,
      sunset: now + 21600
    },
    main: {
      temp: temp,
      feels_like: temp - 1,
      temp_min: temp - 4,
      temp_max: temp + 3,
      humidity: 65,
      pressure: 1013
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'Clear sky',
        icon: '01d'
      }
    ],
    wind: {
      speed: isImperial ? 8 : 3.6,
      deg: 180
    },
    visibility: 10000,
    clouds: {
      all: 10
    }
  }
}

const generateDemoForecast = (unit) => {
  const isImperial = unit === 'imperial'
  const list = []
  const today = new Date()

  for (let i = 1; i <= 5; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dt = Math.floor(d.getTime() / 1000)
    const baseC = 20 + (i % 3)
    const temp = isImperial ? Math.round((baseC * 9) / 5 + 32) : baseC

    list.push({
      dt: dt,
      dt_txt: `${d.toISOString().split('T')[0]} 12:00:00`,
      main: {
        temp: temp,
        humidity: 60 + i * 2
      },
      weather: [
        {
          main: i % 2 === 0 ? 'Clouds' : 'Clear',
          description: i % 2 === 0 ? 'scattered clouds' : 'sunny',
          icon: i % 2 === 0 ? '03d' : '01d'
        }
      ]
    })
  }

  return { list }
}

function Weather({ unit, apiKey, onOpenApiSettings, onThemeChange }) {
  const [city, setCity] = useState('London')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Map OpenWeatherMap condition to theme class
  const updateTheme = useCallback((weatherMain) => {
    if (!weatherMain) return
    const mainLower = weatherMain.toLowerCase()
    let theme = 'theme-clear'

    if (mainLower.includes('cloud')) {
      theme = 'theme-clouds'
    } else if (mainLower.includes('rain') || mainLower.includes('drizzle')) {
      theme = 'theme-rain'
    } else if (mainLower.includes('thunder')) {
      theme = 'theme-thunderstorm'
    } else if (mainLower.includes('snow')) {
      theme = 'theme-snow'
    } else if (mainLower.includes('mist') || mainLower.includes('fog') || mainLower.includes('haze')) {
      theme = 'theme-mist'
    }

    onThemeChange?.(theme)
  }, [onThemeChange])

  // Fetch weather by City Name
  const fetchWeatherByCity = useCallback(
    async (targetCity) => {
      if (!targetCity.trim()) return

      setLoading(true)
      setError(null)

      // Check if API key is provided
      if (!apiKey || apiKey.trim() === '') {
        // Fallback to demo mode
        setTimeout(() => {
          const demoWeather = generateDemoWeather(targetCity, unit)
          const demoForecast = generateDemoForecast(unit)
          setWeatherData(demoWeather)
          setForecastData(demoForecast)
          setIsDemoMode(true)
          setLoading(false)
          updateTheme(demoWeather.weather[0].main)
        }, 300)
        return
      }

      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          targetCity
        )}&units=${unit}&appid=${apiKey}`

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          targetCity
        )}&units=${unit}&appid=${apiKey}`

        const [weatherRes, forecastRes] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl)
        ])

        setWeatherData(weatherRes.data)
        setForecastData(forecastRes.data)
        setIsDemoMode(false)
        setCity(targetCity)
        updateTheme(weatherRes.data.weather?.[0]?.main)
      } catch (err) {
        console.error('Weather API fetch error:', err)
        if (err.response?.status === 404) {
          setError(`City "${targetCity}" not found. Please check spelling.`)
        } else if (err.response?.status === 401) {
          setError(
            'Invalid OpenWeatherMap API key. Please check your key or configure a valid one.'
          )
          // Fallback to sample data for visual feedback
          const demoWeather = generateDemoWeather(targetCity, unit)
          const demoForecast = generateDemoForecast(unit)
          setWeatherData(demoWeather)
          setForecastData(demoForecast)
          setIsDemoMode(true)
          updateTheme(demoWeather.weather[0].main)
        } else {
          setError(
            err.response?.data?.message || 'Failed to fetch weather data. Please try again later.'
          )
        }
      } finally {
        setLoading(false)
      }
    },
    [apiKey, unit, updateTheme]
  )

  // Fetch weather by Geolocation Coordinates
  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      setLoading(true)
      setError(null)

      if (!apiKey || apiKey.trim() === '') {
        setTimeout(() => {
          const demoWeather = generateDemoWeather('Your Location', unit)
          const demoForecast = generateDemoForecast(unit)
          setWeatherData(demoWeather)
          setForecastData(demoForecast)
          setIsDemoMode(true)
          setLoading(false)
          updateTheme(demoWeather.weather[0].main)
        }, 300)
        return
      }

      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`

        const [weatherRes, forecastRes] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl)
        ])

        setWeatherData(weatherRes.data)
        setForecastData(forecastRes.data)
        setIsDemoMode(false)
        setCity(weatherRes.data.name)
        updateTheme(weatherRes.data.weather?.[0]?.main)
      } catch (err) {
        console.error('Geolocation weather fetch error:', err)
        setError('Failed to fetch weather for your location.')
      } finally {
        setLoading(false)
      }
    },
    [apiKey, unit, updateTheme]
  )

  // Fetch on mount or when unit/apiKey changes
  useEffect(() => {
    fetchWeatherByCity(city)
  }, [fetchWeatherByCity, unit])

  return (
    <div className="weather-main-content">
      {/* Search Bar */}
      <SearchBar
        onSearch={(newCity) => {
          setCity(newCity)
          fetchWeatherByCity(newCity)
        }}
        onLocationSearch={(lat, lon) => {
          fetchWeatherByCoords(lat, lon)
        }}
        currentCity={city}
        loading={loading}
      />

      {/* Notice / Demo Mode Banner */}
      <div className="banner-container">
        {error && (
          <div className="banner banner-error">
            <div className="banner-content">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            {error.includes('API key') && (
              <button
                type="button"
                className="banner-btn"
                onClick={onOpenApiSettings}
              >
                Set Key
              </button>
            )}
          </div>
        )}

      </div>

      {/* Loading Skeleton / Spinner */}
      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Fetching live weather report...</p>
        </div>
      ) : (
        /* Weather Cards */
        weatherData && (
          <WeatherCard
            data={weatherData}
            forecast={forecastData}
            unit={unit}
          />
        )
      )}
    </div>
  )
}

export default Weather
