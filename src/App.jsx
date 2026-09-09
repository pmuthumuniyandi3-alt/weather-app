import React, { useState, useEffect } from 'react'
import Weather from './components/Weather'
import { CloudSun, Settings, X, Key, ExternalLink } from 'lucide-react'
import './App.css'

function App() {
  const [unit, setUnit] = useState('metric') // 'metric' (°C) or 'imperial' (°F)
  const [showApiModal, setShowApiModal] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem('weather_app_api_key') ||
      import.meta.env.VITE_OPENWEATHER_API_KEY ||
      ''
    )
  })
  const [tempApiKeyInput, setTempApiKeyInput] = useState(apiKey)

  // Update body theme class dynamically
  const handleThemeChange = (themeName) => {
    document.body.className = themeName
  }

  const handleSaveApiKey = (e) => {
    e.preventDefault()
    const trimmed = tempApiKeyInput.trim()
    setApiKey(trimmed)
    localStorage.setItem('weather_app_api_key', trimmed)
    setShowApiModal(false)
  }

  const handleClearApiKey = () => {
    setApiKey('')
    setTempApiKeyInput('')
    localStorage.removeItem('weather_app_api_key')
    setShowApiModal(false)
  }

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="app-header">
        <div className="brand-area">
          <div className="brand-icon">
            <CloudSun size={26} />
          </div>
          <div>
            <h1 className="brand-title">WeatherCast</h1>
            <p className="brand-subtitle">Live Meteorological Weather Intelligence</p>
          </div>
        </div>

        <div className="header-controls">
          {/* Unit Toggle */}
          <div className="unit-toggle-btn" role="group" aria-label="Temperature unit selector">
            <button
              type="button"
              className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => setUnit('metric')}
              title="Celsius"
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => setUnit('imperial')}
              title="Fahrenheit"
            >
              °F
            </button>
          </div>

          {/* API Key Modal Trigger */}
          <button
            type="button"
            className="api-settings-btn"
            onClick={() => {
              setTempApiKeyInput(apiKey)
              setShowApiModal(true)
            }}
            title="Configure OpenWeatherMap API Key"
          >
            <span className={`api-status-dot ${apiKey ? '' : 'demo'}`}></span>
            <Key size={16} />
            <span>{apiKey ? 'API Configured' : 'Demo Mode'}</span>
          </button>
        </div>
      </header>

      {/* Main Weather View */}
      <main style={{ width: '100%' }}>
        <Weather
          unit={unit}
          apiKey={apiKey}
          onOpenApiSettings={() => {
            setTempApiKeyInput(apiKey)
            setShowApiModal(true)
          }}
          onThemeChange={handleThemeChange}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap API</a> &amp; Axios
        </p>
        <p>© {new Date().getFullYear()} React Weather App • Built strictly with React JS &amp; Vite</p>
      </footer>

      {/* API Key Settings Modal */}
      {showApiModal && (
        <div className="modal-overlay" onClick={() => setShowApiModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Settings size={22} />
                OpenWeatherMap API Key
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowApiModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-desc">
              To fetch live weather data directly from OpenWeatherMap, enter your free API key.
              You can get a free API key at{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                openweathermap.org <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
              .
            </p>

            <form onSubmit={handleSaveApiKey}>
              <div className="modal-input-group">
                <label className="modal-label" htmlFor="apiKeyInput">
                  API Key
                </label>
                <input
                  id="apiKeyInput"
                  type="text"
                  className="modal-input"
                  placeholder="Paste your 32-character API key..."
                  value={tempApiKeyInput}
                  onChange={(e) => setTempApiKeyInput(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                {apiKey && (
                  <button
                    type="button"
                    className="modal-btn-cancel"
                    onClick={handleClearApiKey}
                  >
                    Remove Key (Use Demo)
                  </button>
                )}
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowApiModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-save">
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
