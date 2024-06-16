import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    weather: null,
    weatherIconUrl: '',
    error: null,
    pending: false
  }),
  actions: {
    async fetchWeather(city) {
      this.pending = true
      try {
        const apiKey = '84c3e4a3b0f58d647710ca144f2cc287'
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
        
        const geoResponse = await fetch(geoUrl)
        const geoData = await geoResponse.json()

        if (geoData.length === 0) {
          this.error = 'City not found'
          this.weather = null
          this.pending = false
          return
        }

        const { lat, lon } = geoData[0]
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

        const response = await fetch(weatherUrl)
        const weatherData = await response.json()

        
        weatherData.main.temp = Math.round(weatherData.main.temp)
        weatherData.main.feels_like = Math.round(weatherData.main.feels_like)

        this.weather = weatherData
        this.weatherIconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        this.error = null

    
        localStorage.setItem('lastCity', city)
        localStorage.setItem('lastWeather', JSON.stringify(this.weather))
      } catch (err) {
        this.error = 'An error occurred while fetching the weather data.'
        this.weather = null
        this.weatherIconUrl = ''
        console.error(err)
      } finally {
        this.pending = false
      }
    },
    loadLastCityWeather() {
      const lastCity = localStorage.getItem('lastCity')
      const lastWeather = localStorage.getItem('lastWeather')
      if (lastCity && lastWeather) {
        this.city = lastCity
        this.weather = JSON.parse(lastWeather)
        this.weatherIconUrl = `http://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`
      }
    }
  }
})