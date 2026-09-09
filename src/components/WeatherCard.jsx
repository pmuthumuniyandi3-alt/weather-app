import React from 'react'
import {
  Droplets,
  Wind,
  Compass,
  Eye,
  Gauge,
  Cloud,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react'

function WeatherCard({ data, forecast, unit }) {
  if (!data) return null

  const tempSymbol = unit === 'imperial' ? '°F' : '°C'
  const speedUnit = unit === 'imperial' ? 'mph' : 'm/s'

  // Format Unix timestamp to local time
  const formatTime = (timestamp, timezoneOffsetSeconds = 0) => {
    if (!timestamp) return '--:--'
    // UTC milliseconds + timezone offset milliseconds
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000)
    return date.toUTCString().slice(17, 22)
  }

  const formatDate = (timestamp, timezoneOffsetSeconds = 0) => {
    if (!timestamp) return ''
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000)
    const options = { weekday: 'long', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Format wind direction in cardinal points
  const getWindDirection = (degrees) => {
    if (degrees === undefined || degrees === null) return ''
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round((degrees % 360) / 45) % 8
    return directions[index]
  }

  // Extract daily forecast (one entry per day at around 12:00)
  const processDailyForecast = () => {
    if (!forecast || !forecast.list) return []
    const dailyMap = {}

    forecast.list.forEach((item) => {
      const date = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0]
      // Pick midday reading (~12:00:00) or first entry
      if (!dailyMap[date] || item.dt_txt?.includes('12:00:00')) {
        dailyMap[date] = item
      }
    })

    return Object.values(dailyMap).slice(0, 5)
  }

  const dailyForecast = processDailyForecast()

  return (
    <div className="weather-card-container">
      {/* Hero Weather Card */}
      <div className="weather-hero-card">
        <div className="hero-left">
          <div className="location-title">
            <h1 className="city-name">{data.name}</h1>
            {data.sys?.country && (
              <span className="country-code">{data.sys.country}</span>
            )}
          </div>

          <p className="current-time">
            {formatDate(data.dt, data.timezone)} • {formatTime(data.dt, data.timezone)}
          </p>

          <div className="temp-display-wrap">
            <span className="temperature-value">{Math.round(data.main?.temp)}</span>
            <span className="temperature-unit">{tempSymbol}</span>
          </div>

          <div className="weather-condition-badge">
            <span>{data.weather?.[0]?.description || 'Clear'}</span>
          </div>

          <div className="temp-range">
            <span>
              <ArrowUp size={16} color="#fb7185" />
              High: {Math.round(data.main?.temp_max)}{tempSymbol}
            </span>
            <span>
              <ArrowDown size={16} color="#38bdf8" />
              Low: {Math.round(data.main?.temp_min)}{tempSymbol}
            </span>
            <span>
              Feels like: {Math.round(data.main?.feels_like)}{tempSymbol}
            </span>
          </div>
        </div>

        <div className="hero-right">
          {data.weather?.[0]?.icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
              alt={data.weather[0].description}
              className="weather-large-icon"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <Cloud size={120} className="weather-large-icon" />
          )}
        </div>
      </div>

      {/* Detailed Weather Stats Grid */}
      <div className="weather-details-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap cyan">
            <Droplets size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Humidity</span>
            <span className="metric-value">{data.main?.humidity}%</span>
            <span className="metric-subtext">The dew point is normal</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap blue">
            <Wind size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Wind Speed</span>
            <span className="metric-value">
              {Math.round(data.wind?.speed)} {speedUnit}
            </span>
            <span className="metric-subtext">
              Direction: {getWindDirection(data.wind?.deg)} ({data.wind?.deg ?? 0}°)
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap amber">
            <Gauge size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pressure</span>
            <span className="metric-value">{data.main?.pressure} hPa</span>
            <span className="metric-subtext">Barometric</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap emerald">
            <Eye size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Visibility</span>
            <span className="metric-value">
              {data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'Unlimited'}
            </span>
            <span className="metric-subtext">Distance clarity</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap blue">
            <Cloud size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Cloud Cover</span>
            <span className="metric-value">{data.clouds?.all ?? 0}%</span>
            <span className="metric-subtext">Sky coverage</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap amber">
            <Sunrise size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Sunrise</span>
            <span className="metric-value">
              {formatTime(data.sys?.sunrise, data.timezone)}
            </span>
            <span className="metric-subtext">Morning light</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap rose">
            <Sunset size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Sunset</span>
            <span className="metric-value">
              {formatTime(data.sys?.sunset, data.timezone)}
            </span>
            <span className="metric-subtext">Dusk / Twilight</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {dailyForecast.length > 0 && (
        <div className="forecast-section">
          <h2 className="forecast-heading">
            <Calendar size={20} />
            5-Day Weather Forecast
          </h2>
          <div className="forecast-grid">
            {dailyForecast.map((item, idx) => {
              const forecastDate = new Date(item.dt * 1000)
              const dayName = idx === 0 ? 'Today' : forecastDate.toLocaleDateString('en-US', { weekday: 'short' })
              const formattedDate = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              const iconCode = item.weather?.[0]?.icon

              return (
                <div key={item.dt} className="forecast-card">
                  <span className="forecast-day">{dayName}</span>
                  <span className="forecast-date">{formattedDate}</span>
                  {iconCode && (
                    <img
                      src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                      alt={item.weather?.[0]?.description || 'Forecast icon'}
                      className="forecast-icon"
                    />
                  )}
                  <span className="forecast-temp">
                    {Math.round(item.main?.temp)}{tempSymbol}
                  </span>
                  <span className="forecast-desc">
                    {item.weather?.[0]?.main || ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherCard
