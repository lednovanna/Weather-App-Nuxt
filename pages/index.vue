<template>
  <main>
    <div class="container-fluid text-center">
      <div class="row">
        <div class="col-12">
           
          <h1 style="color: #434B4D">Das Wetter App</h1>
          <div class="input-form w-50 mx-auto mt-5 ">
            <input v-model="city" class="form-control" type="text" spellcheck="false" placeholder="Stadtname" />
          </div>
          <button @click="fetchWeather" class="btn btn-lg btn-secondary px-5 mt-4">Suchen</button>
          <div v-if="pending" class="mt-5">
            <p>Loading...</p>
          </div>
          <div v-if="weather && !pending" class="mt-5">

            <h2 style="color: #434B4D">{{ weather.name }}</h2>
             <img :src="weatherIconUrl" alt="Weather Icon" />
              <div class="card card-transparent w-50 mx-auto mt-5 ">
               <div class="card-body text-lg-center " style="color: #434B4D" >
            <p>Temperature: {{ weather.main.temp }} °C </p>
            <p>Wetterbeschreibung: {{ weather.weather[0].description }}</p>
           <p>Windgeschwindigkeit: {{ weather.wind.speed }} m/s</p>
            <p>Luftfeuchtigkeit: {{ weather.main.humidity }} %</p>
               </div>
           </div>
          </div>
          <div v-if="error" class="mt-5 text-danger">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '~/stores/weather'
import { useAsyncData } from '#app'

const store = useWeatherStore()
const city = ref('')
const weather = ref(null)
const weatherIconUrl = ref('')
const error = ref(null)

const fetchWeather = async () => {
  store.city = city.value
  await store.fetchWeather(city.value)
  weather.value = store.weather
  weatherIconUrl.value = store.weatherIconUrl
  error.value = store.error
}

onMounted(() => {
  store.loadLastCityWeather()
  if (store.city) {
    city.value = store.city
    weather.value = store.weather
    weatherIconUrl.value = store.weatherIconUrl
  }
})

const { data } = await useAsyncData('weather', () => store.fetchWeather(city.value))
</script>

<style scoped>
main {
  background-image: url('https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  padding: 200px 0;
}

.card{
    background-color: #faf9f9;
    
    max-width: 500px;
}

.card-transparent {
  background-color: rgba(255, 255, 255, 0.2); 
}

.card-body{
    font-weight: 500;
    padding: 20px;
   
}
</style>