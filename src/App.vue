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

              <li v-if="isLoggedIn" class="nav-item">
               <RouterLink class="nav-link active" to="/announce">Annoncer</RouterLink>
              </li>

              <li v-if="isLoggedIn" class="nav-item">
               <RouterLink class="nav-link active" to="/my-announces"><i class="fas fa-bullhorn"></i> Mes annonces</RouterLink>
              </li>

              <li class="nav-item dropdown">
                <select 
                  v-model="selectedStyle" 
                  class="form-select bg-dark text-white border-0 shadow-sm mt-0"
                  @change="redirectToStylePage "
                >  
                  <option disabled value="">Style</option>              
                  <option v-for="style in styles" :key="style" :value="style">{{ style }}</option>
                </select>
              </li>

              <!-- Affichage dynamique selon l'état de connexion -->
              <li v-if="!isLoggedIn" class="nav-item ms-3">
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
        <button type="button" class="btn-close" @click="clearSuccessMessage"></button>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Définition des refs et variables
const user = ref(null)
const isLoggedIn = ref(false)
const successMessage = ref('')
const styles = ref([]) 
const selectedStyle = ref('') 
const apiUrl = 'http://127.0.0.1:8000/api'
// const apiUrl = 'http://musicianmanagement.gabriel-cassano.be/api';

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

  fetchStyles()
})

// Récupérer les styles depuis l'API Laravel
const fetchStyles = async () => {
  try {
    const response = await axios.get(`${apiUrl}/styles`) 

    if (response.status === 200) {
      styles.value = response.data.styles  
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des styles:', error)
  }
}

const redirectToStylePage = () => {
  if (selectedStyle.value) {
    router.push(`/musicians?style=${selectedStyle.value}`)
  }
}

// Fonction pour effacer manuellement le message de succès
const clearSuccessMessage = () => {
  successMessage.value = ''
}

// Fonction de déconnexion
const handleLogout = async () => {
  try {   
    const response = await axios.post(`${apiUrl}/logout`, {}, {
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

      // Suppression automatique après 3 secondes
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)

      // Rediriger vers la page de connexion
      router.push('/login')
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>

<style>
.form-select {
  background-color: #343a40 !important; /* Couleur sombre */
  color: white !important; /* Texte blanc */
  border: none !important; /* Supprime la bordure */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Ombre légère */
}
.form-select:focus {
  outline: none;
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5); /* Glow blanc au focus */
}

.nav-item select {
  height: 38px; /* Hauteur égale aux autres éléments du menu */
  padding: 5px 10px; /* Espacement interne */
  font-size: 16px; /* Taille du texte */
  border-radius: 5px; /* Coins arrondis */
  border: 1px solid transparent;
  background-color: #212529; /* Fond sombre */
  color: white; /* Texte blanc */
  cursor: pointer;
}

.nav-item .custom-select {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-decoration: none;
}

.nav-item .custom-select:focus {
  outline: none;
}

.nav-item .custom-select option {
  background-color: #343a40; /* Fond sombre */
  color: white;
}

</style>
