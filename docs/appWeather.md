Um den Produktionsserver zu starten, führen Sie Folgendes aus:
npm run dev

Pages: index.vue

Die Anwendung verwendet Pinia zur Statusverwaltung. Der useWeatherStore-Speicher verwaltet den Status der Wetterdaten und der gesuchten Stadt.

Das Wetter App benutzt _Bootstrap_ für __Styling__.

__Kommentare__:

__#weaher.js__

__// Pinia Store für Wetterdaten__
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    weather: null,
    weatherIconUrl: '',
    error: null,
    pending: false
  }),
  actions: {

__//Holt Wetterdaten für die angegebene Stadt__
async fetchWeather() {
      this.pending = true;
      try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&appid=${apiKey}`;
        
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
          this.error = 'City not found';
          this.weather = null;
          this.pending = false;
          return;
        }

        const { lat, lon } = geoData[0];
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const { data, error: fetchError } = await useFetch(weatherUrl);

        if (fetchError.value) {
          throw new Error(fetchError.value.message);
        }

        const weatherData = data.value;

        __//Temperaturwerte Runde__
        weatherData.main.temp = Math.round(weatherData.main.temp)
        weatherData.main.feels_like = Math.round(weatherData.main.feels_like)

        __//Daten speichern im localStorage__
         localStorage.setItem('lastCity', this.city);
        localStorage.setItem('lastWeather', JSON.stringify(this.weather));
      } catch (err) {
        this.error = 'An error occurred while fetching the weather data.';
        this.weather = null;
        this.weatherIconUrl = '';
        console.error(err);
      } finally {
        this.pending = false;
      }
    },
    __//Gesuchte Stadt- und Wetterdaten lädt aus dem localStorage__
    loadLastCityWeather() {
      const lastCity = localStorage.getItem('lastCity');
      const lastWeather = localStorage.getItem('lastWeather');
      if (lastCity && lastWeather) {
        this.city = lastCity;
        this.weather = JSON.parse(lastWeather);
        this.weatherIconUrl = `http://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`;
      }
    }
  }
});



__#index.vue__

__//Importieren Sie die erforderlichen Funktionen aus Vue und Nuxt__
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '~/stores/weather'
import { useAsyncData } from '#app'

__//Initialisiere den Wetterspeicher__
const store = useWeatherStore()

__// Variablen erstellen, um die Stadt, die Wetterdaten, die URL des Wettersymbols und den Fehler zu speichern__
const city = ref('')
const weather = ref(null)
const weatherIconUrl = ref('')
const error = ref(null)

__// Asynchrone Funktion zum Abrufen von Wetterdaten__
const fetchWeather = async () => {

  __//Wetterdaten anfordern aus dem Speicher __
  await store.fetchWeather(city.value)

  __// Aktualisieren lokale reaktive Variablen mit Daten aus dem Speicher__
    weather.value = store.weather
  weatherIconUrl.value = store.weatherIconUrl
  error.value = store.error
}

__//OnMounted-Hook zum Ausführen von Code, wenn die Komponente gemountet wird__
onMounted(() => {
  __// Laden Sie die neuesten Wetterdaten aus dem Speicher__
  store.loadLastCityWeather()
  __// Wenn Stadtdaten gespeichert sind, aktualisieren Sie lokale reaktive Variablen__
  if (store.city) {
    city.value = store.city
    weather.value = store.weather
    weatherIconUrl.value = store.weatherIconUrl
  }
})

__// Verwenden Sie useAsyncData, um beim Rendern des Servers Wetterdaten asynchron zu bekommen__
const { data } = await useAsyncData('weather', () => store.fetchWeather(city.value))
</script>

