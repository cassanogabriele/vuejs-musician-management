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

    <!-- Page de contenu -->
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Définition des refs et variables
const user = ref(null)
const isLoggedIn = ref(false)
const logoutMessage = ref('') // Message de déconnexion
const successMessage = ref('') // Message de connexion

// Fonction de vérification de l'état de l'utilisateur
const checkUser = () => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isLoggedIn.value = true
    logoutMessage.value = ''
  } else {
    isLoggedIn.value = false
    successMessage.value = ''
  }
}

// Appel de checkUser pour vérifier l'état au démarrage
onMounted(() => {
  checkUser()
  // Ajout d'un écouteur d'événements pour mettre à jour l'état lors de la connexion/déconnexion
  window.addEventListener('userUpdated', checkUser)
})

// Fonction de déconnexion
const handleLogout = () => {
  // Vider les données de l'utilisateur dans le localStorage
  localStorage.removeItem('user')
  localStorage.removeItem('token')

  // Déconnecter l'utilisateur et réinitialiser les refs
  user.value = null
  isLoggedIn.value = false

  // Informer les autres composants que l'utilisateur a été mis à jour
  window.dispatchEvent(new Event('userUpdated'))

  // Redirection vers la page d'accueil après la déconnexion
  router.push('/')
}
</script>
