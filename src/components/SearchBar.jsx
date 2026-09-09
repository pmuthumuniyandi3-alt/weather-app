import React, { useState } from 'react'
import { Search, MapPin, X, Navigation } from 'lucide-react'

const POPULAR_CITIES = [
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'Chennai',
  'Sydney',
  'Dubai',
  'Singapore'
]

function SearchBar({ onSearch, onLocationSearch, currentCity, loading }) {
  const [query, setQuery] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  const handleQuickChipClick = (city) => {
    setQuery(city)
    onSearch(city)
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false)
        const { latitude, longitude } = position.coords
        onLocationSearch(latitude, longitude)
      },
      (error) => {
        setGeoLoading(false)
        console.warn('Geolocation error:', error)
        alert('Could not retrieve your location. Please check your browser location permissions or search by city name.')
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <span className="search-input-icon">
          <Search size={20} />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search city, state, or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <div className="search-action-btns">
          <button
            type="button"
            className="location-btn"
            onClick={handleCurrentLocation}
            disabled={geoLoading || loading}
            title="Use current location"
          >
            <Navigation size={18} className={geoLoading ? 'spin-icon' : ''} />
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !query.trim()}
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick City Filters */}
      <div className="quick-chips-wrapper">
        <span className="quick-chip-label">Popular:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            className={`quick-chip-btn ${currentCity?.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
            onClick={() => handleQuickChipClick(city)}
            disabled={loading}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
