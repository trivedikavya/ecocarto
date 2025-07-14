# 🌍 EcoCarto: Environmental Health Mapping Platform  

**Making ecological awareness accessible and actionable for everyone**  

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://v0-eco-health-map-project.vercel.app/) 
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  



## 🚀 Overview  
EcoCarto is an interactive web-based Environmental Health Map that visualizes the ecological status of any location using real-time air quality (AQI) and vegetation index (NDVI) data. Born from the need to address rising pollution and climate challenges, this tool empowers individuals, planners, and communities to make informed environmental decisions.  

**Core Solution**: Combines real-time ecological data with historical context through intuitive visualizations and actionable insights.  

---

## ✨ Key Features  
- **🌱 Eco Score System** - A-F grade combining AQI, vegetation, humidity & temperature  
- **🟢🔴 Risk Visualization** - Color-coded zones (Green/Moderate/High Risk)  
- **📅 Historical Trends** - Environmental data from 2015 to present  
- **🌿 Smart Plantation** - Data-driven recommendations for degraded areas  
- **📊 Downloadable Reports** - PDF exports for ecological planning  
- **🔥 Interactive Heatmaps** - AQI/NDVI visualization layers  
- **📍 Live Location Search** - With geolocation suggestions  

---

## 🛠️ Tech Stack  
![Cursor&V0](https://img.shields.io/badge/Cursor&V0-black?logo=Cursor&V0) 
![React](https://img.shields.io/badge/React-18.2-blue?logo=react) 
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blueviolet?logo=tailwind-css)  

### Visualization  
![Leaflet.js](https://img.shields.io/badge/Leaflet.js-1.9-green?logo=leaflet) 
![Recharts](https://img.shields.io/badge/Recharts-2.0-lightgrey) 
![Google Maps API](https://img.shields.io/badge/Google_Maps_API-v3.0-blue?logo=google-maps)  

### Data APIs  
```mermaid
graph LR
A[Air Quality] --> OpenAQ
B[Vegetation] --> NASA_EarthData
C[Weather] --> Open-Meteo
D[Geocoding] --> Google_Maps
```

### Roadmap
```mermaid
graph TD
    A[Next.js Server Components] --> B[Database Integration]
    B --> C[Predictive ML Models]
    C --> D[Pollution Forecasting]
    A --> E[PWA Offline Mode]
    B --> F[User Report History]
```
