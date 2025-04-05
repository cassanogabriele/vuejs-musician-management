<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <RouterLink class="navbar-brand" to="/">Musician Management</RouterLink>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/">Accueil</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/about">À propos</RouterLink>
              </li>

              <!-- Affichage dynamique selon l'état de connexion -->
              <li v-if="!isLoggedIn" class="nav-item">
                <RouterLink class="btn btn-outline-success" to="/login">Connexion</RouterLink>
              </li>
              <li v-if="!isLoggedIn" class="nav-item">
                <RouterLink class="btn btn-outline-primary ms-2" to="/register">Inscription</RouterLink>
              </li>
              <li v-if="isLoggedIn" class="nav-item">
                <span class="nav-link">Bienvenue, {{ user.name }}</span>
              </li>
              <li v-if="isLoggedIn" class="nav-item">
                <button class="btn btn-outline-danger" @click="handleLogout">Déconnexion</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div class="container mt-5">
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''"></button>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Définition des refs et variables
const user = ref(null)
const isLoggedIn = ref(false)
const successMessage = ref('')

// Vérifier l'état de connexion lors du montage
const checkUser = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
}

// Appel de checkUser lors du montage du composant
onMounted(() => {
  checkUser()

  // Si un message de succès est présent dans sessionStorage, le montrer
  const messageFromSession = sessionStorage.getItem('successMessage')
  if (messageFromSession) {
    successMessage.value = messageFromSession
    sessionStorage.removeItem('successMessage')
  }

  // Écouteur d'événements pour gérer les changements dans l'état de l'utilisateur
  window.addEventListener('userUpdated', checkUser)
})

// Fonction pour afficher un message de succès
const showMessage = (message) => {
  successMessage.value = message
  setTimeout(() => successMessage.value = '', 3000)
}

// Fonction de déconnexion
const handleLogout = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.status === 200) {
      // Suppression des données de l'utilisateur du localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      user.value = null
      isLoggedIn.value = false

      // Informer les autres composants que l'utilisateur a été mis à jour
      window.dispatchEvent(new Event('userUpdated'))

      // Rediriger vers la page d'accueil avec un message
      successMessage.value = 'Vous êtes déconnecté !'
      sessionStorage.setItem('successMessage', successMessage.value)

      // Rediriger vers la page de connexion
      router.push('/login')
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
