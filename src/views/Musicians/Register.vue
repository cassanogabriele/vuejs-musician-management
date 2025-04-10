<template>
  <div class="container mt-5">
    <h2>Inscription</h2>    

    <form @submit.prevent="handleRegister">   
      <div class="mb-3">
        <label>Nom</label>
        <input type="text" v-model="name" class="form-control" />
        <p v-if="errors.name" class="alert alert-danger mt-3">{{ errors.name[0] }}</p>
      </div>

      <div class="mb-3">
        <label>Email</label>
        <input type="text" v-model="email" class="form-control" />
        <p v-if="errors.email" class="alert alert-danger mt-3">{{ errors.email[0] }}</p>
      </div>

      <div class="mb-3">
        <label>Mot de passe</label>
        <input type="password" v-model="password" class="form-control" />
        <p v-if="errors.password" class="alert alert-danger mt-3">{{ errors.password[0] }}</p>
      </div>

      <button type="submit" class="btn btn-success">S'inscrire</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Champs de formulaire
const name = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('alert-success') // Par défaut une alerte verte (succès)
const errors = ref({})
const apiUrl = 'http://127.0.0.1:8000/api'; 
// const apiUrl = 'http://musicianmanagement.gabriel-cassano.be/api';

const handleRegister = async () => {
  try {
    // Envoi des données au serveur Laravel
    const response = await axios.post(`${apiUrl}/register`, {
      name: name.value,
      email: email.value,
      password: password.value
    })

    // Message de succès
    message.value = 'Inscription réussie !'
    messageType.value = 'alert-success'

    // Réinitialiser les erreurs
    errors.value = {}

    // Stocker l'utilisateur et le token dans localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('token', response.data.token)

    // Redirection vers la page login avec un message de succès
    router.push({ name: 'login', query: { successMessage: 'Inscription réussie !' } })
  } catch (error) {
    // Gérer les erreurs de validation de Laravel
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors // Récupérer les erreurs des champs
      message.value = 'Veuillez corriger les erreurs ci-dessus.'
      messageType.value = 'alert-danger' // Alerte rouge pour les erreurs
    } else {
      // Message d'erreur générique en cas d'échec
      message.value = 'Erreur lors de l’inscription'
      messageType.value = 'alert-danger'
    }
  }
}
</script>
