# ☀️ React Weather Report Application

A modern, responsive, and dynamic Weather Report Application built strictly with **React JS**, **Vite**, and **Axios**, powered by the **OpenWeatherMap API**.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?logo=axios&logoColor=white)

---

## 🚀 Features

- 🔍 **Real-Time City Weather Search**: Search for any city in the world with instant weather metrics.
- 📍 **Geolocation Detection**: "Use My Location" button detects your current coordinates using HTML5 Geolocation API.
- ⚡ **Popular Quick-Picks**: Clickable city tags (London, New York, Tokyo, Paris, Chennai, Sydney, Dubai, etc.).
- 🌡️ **Dual Unit Toggle**: Effortlessly switch between Celsius (°C) and Fahrenheit (°F).
- 📊 **Comprehensive Weather Metrics**:
  - Temperature, Feels-like, Min & Max temperatures
  - Humidity, Atmospheric pressure, Wind speed & direction
  - Visibility, Cloud coverage, Sunrise & Sunset times
- 📅 **5-Day Weather Forecast**: Clean forecast cards displaying upcoming daily conditions.
- 🎨 **Adaptive Weather Themes**: Dynamic visual backgrounds responding to current weather (clear, clouds, rain, snow, thunderstorm, mist/fog).
- 📱 **100% Fully Responsive**: Pixel-perfect layout across Mobile, Tablet, and Desktop screens.
- 🔑 **Flexible API Key Management**:
  - Configure via `.env` file (`VITE_OPENWEATHER_API_KEY`)
  - Or enter/update your API key anytime via the in-app settings modal (persists in `localStorage`).
  - Includes an interactive demo/fallback mode so the app works seamlessly even without an immediate API key.

---

## 📁 Project Structure

```
React_weathe_app/
├── index.html
├── package.json
├── vite.config.js
├── .env
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── components/
    │   ├── Weather.jsx       # Core weather container (state management, API calls via Axios, error/loading states)
    │   ├── SearchBar.jsx     # Search input, geolocation button, popular city quick-chips
    │   └── WeatherCard.jsx   # Current weather card, stats grid (humidity, wind, pressure, sunrise/sunset), 5-day forecast
    ├── App.jsx               # Main application layout, header, unit switcher (°C/°F), API key settings modal
    ├── App.css               # Application layout styling and animations
    ├── index.css             # Global typography, CSS variables, resets, and responsive media queries
    └── main.jsx              # React root render
```

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) and npm installed:
```bash
node -v
npm -v
```

### Installation
1. Clone the repository:
```bash
git clone https://github.com/pmuthumuniyandi3-alt/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up your OpenWeatherMap API Key:
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```
> *Note: You can also enter your API key directly inside the app using the "API Key" button.*

4. Start the development server:
```bash
npm run dev
```

5. Open your browser at:
```
http://localhost:5173/
```

---

## 📦 Build for Production

To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📄 License
MIT License
