<template>
  <div class="container mt-5">
    <h2 v-if="!isLoggedIn">Connexion</h2>

    <!-- Message de succès pour la connexion -->
    <div v-if="successMessage && isLoggedIn" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>

    <!-- Formulaire de connexion -->
    <form v-if="!isLoggedIn" @submit.prevent="handleLogin">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" v-model="email" class="form-control" required />
        <p v-if="errors.email" class="alert alert-danger mt-1">{{ errors.email[0] }}</p>
      </div>
      <div class="mb-3">
        <label>Mot de passe</label>
        <input type="password" v-model="password" class="form-control" required />
        <p v-if="errors.password" class="alert alert-danger mt-1">{{ errors.password[0] }}</p>
      </div>
      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form> 
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const successMessage = ref('')
const errors = ref({})
const isLoggedIn = ref(false)
const user = ref({})

// Fonction de gestion de la connexion
const handleLogin = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value
    })

    // Stocker l'utilisateur et le token dans le localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('token', response.data.token)

    // Mettre à jour l'état utilisateur
    user.value = response.data.user
    isLoggedIn.value = true
   
    // Informer les autres composants que l'utilisateur a été mis à jour
    window.dispatchEvent(new Event('userUpdated'))

    // Rediriger vers la page d'accueil
    router.push('/')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    }
  }
}
</script>
