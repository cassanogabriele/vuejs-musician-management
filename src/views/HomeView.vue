<template>
  <div v-if="successMessage" class="alert alert-success alert-dismissible fade show container mt-2" role="alert">
    {{ successMessage }}
    <button type="button" class="btn-close" @click="successMessage = ''"></button>
   </div>

  <div class="container mt-5">
   
    <h2 class="title">🎵 Musiciens récemment ajoutés</h2>
    
    <div class="card-container">
      <div v-for="musician in musicians" :key="musician.id" class="card">
        <div class="info">
          <h3>{{ musician.name }}</h3>
          <p class="style"><strong>Style :</strong> {{ musician.style }}</p>
          <p><strong>Email :</strong> {{ musician.email }}</p>
          <p><strong>Téléphone :</strong> {{ musician.phone }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const musicians = ref([])
const successMessage = ref('')
const apiUrl = 'http://127.0.0.1:8000/api';

const showMessage = (message) => {
  successMessage.value = message
  setTimeout(() => successMessage.value = '', 3000)
}

onMounted(() => {
  const storedMessage = sessionStorage.getItem('successMessage')
  
  if (storedMessage) {
    showMessage(storedMessage)
    sessionStorage.removeItem('successMessage') 
  }
  
  fetchMusicians()
})

const fetchMusicians = async () => {
  try {
    const response = await axios.get(`${apiUrl}/musicians/recent`);
    musicians.value = response.data.musicians
  } catch (error) {
    console.error('Erreur lors de la récupération des musiciens:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #4A4A4A;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background: #fff;
  width: 280px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
}

.info {
  padding: 15px;
  text-align: left;
}

h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 20px;
  font-weight: bold;
}

p {
  font-size: 14px;
  margin: 5px 0;
  color: #555;
}

.style {
  font-weight: bold;
  color: #E44D26;
}
</style>
