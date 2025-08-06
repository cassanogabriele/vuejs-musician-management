<template>
  <div class="container mt-5"> 
    <div v-if="successMessage" class="alert alert-success mt-3">
    {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="alert alert-danger mt-3">
    {{ errorMessage }}
    </div>

    <div v-if="isLoggedIn" class="announcement-form">
      <h2>Ajouter un musicien</h2>

      <form @submit.prevent="submitAnnouncement">
        <div class="mb-3">
          <label for="name" class="form-label">Nom</label>
          <input
            type="text"
            id="name"
            v-model="announcement.name"
            class="form-control"
            :class="{'is-invalid': errors.name}"
            required
          />
          <p v-if="errors.name" class="alert alert-danger mt-1">{{ errors.name[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="style" class="form-label">Style</label>
          <input
            type="text"
            id="style"
            v-model="announcement.style"
            class="form-control"
            :class="{'is-invalid': errors.style}"
            required
          />
          <p v-if="errors.style" class="alert alert-danger mt-1">{{ errors.style[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="announcement.email"
            class="form-control"
            :class="{'is-invalid': errors.email}"
            required
          />
          <p v-if="errors.email" class="alert alert-danger mt-1">{{ errors.email[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Téléphone</label>
          <input
            type="tel"
            id="phone"
            v-model="announcement.phone"
            class="form-control"
            :class="{'is-invalid': errors.phone}"
            required
          />
          <p v-if="errors.phone" class="alert alert-danger mt-1">{{ errors.phone[0] }}</p>
        </div>

        <button type="submit" class="btn btn-primary">Soumettre l'annonce</button>
      </form>     
    </div>
  </div>
</template>

<script setup>
// Importation des fonctionnalités nécessaires de Vue et des bibliothèques

// Pour créer des références réactives et déclencher une fonction au montage du composant
import { ref, onMounted } from 'vue'
// Pour effectuer des requêtes HTTP
import axios from 'axios'
// Pour naviguer entre les routes de l'application
import { useRouter } from 'vue-router' 

// Initialisation du router et des variables réactives
// Utilisation du router pour la navigation
const router = useRouter() 

// Indique si l'utilisateur est connecté ou non
const isLoggedIn = ref(false) 

// Stocke les données de l'utilisateur connecté
const user = ref(null) 

// Message de succès à afficher après une action réussie
const successMessage = ref('') 

// Message d'erreur global
const errorMessage = ref('') 

// Objet pour contenir les erreurs de validation spécifiques aux champs
const errors = ref({}) 

// URL de base de l'API (à adapter en production si besoin)
// const apiUrl = 'http://127.0.0.1:8000/api';
const apiUrl = 'http://musicianmanagement.gabriel-cassano.be/api';

// Déclaration d'un objet réactif pour stocker les données de l'annonce
const announcement = ref({
  // Nom du musicien ou de l'annonce
  name: '',    

  // Style musical
  style: '',   

  // Email de contact
  email: '',   

  // Numéro de téléphone
  phone: '',   

  // ID de l'utilisateur (sera rempli automatiquement)
  userid: '',  
})

// Vérifie si un utilisateur est connecté dès que le composant est monté
onMounted(() => {
  // Récupère les données de l'utilisateur depuis le localStorage
  const storedUser = localStorage.getItem('user') 

  // Si un utilisateur est trouvé dans le localStorage, il est authentifié
  if (storedUser) {
    // Convertit les données JSON en objet JS
    user.value = JSON.parse(storedUser) 
    
    // Indique que l'utilisateur est connecté
    isLoggedIn.value = true 
  }
})

// Fonction pour soumettre une annonce
const submitAnnouncement = async () => {
  // Réinitialise les erreurs éventuelles de la soumission précédente
  errors.value = {}

  // Réinitialise le message d'erreur global
  errorMessage.value = ''

  // Si l'utilisateur n'est pas connecté, on affiche un message d'erreur et on arrête la fonction
  if (!isLoggedIn.value) {
    errorMessage.value = 'Vous devez être connecté pour soumettre une annonce.'
    return
  }

  try {
    // Récupère de nouveau les données de l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user')

    // Convertit les données JSON en objet JS
    const userObject = JSON.parse(storedUser); 
    
    // Extrait l'identifiant de l'utilisateur
    const user_id =  userObject.id; 

    // Envoie une requête POST à l'API pour créer une nouvelle annonce
    const response = await axios.post(`${apiUrl}/announcements`, {
      // Nom de l'annonce
      name: announcement.value.name,     
      
      // Style musical
      style: announcement.value.style,   
      
      // Email de contact
      email: announcement.value.email,   

      // Téléphone de contact
      phone: announcement.value.phone,   

      // ID de l'utilisateur connecté
      userId: user_id                    
    }, {
      // Ajout du token d'authentification dans l'en-tête
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    })

    // Si la requête réussit, on vide le message d'erreur
    errorMessage.value = '' 

    // Déclenche un événement global (utile si d'autres composants doivent se mettre à jour)
    window.dispatchEvent(new Event('userUpdated'))

    // Affiche un message de succès
    successMessage.value = 'Le musicien a été ajouté !'

    // Stocke le message temporairement pour d'autres pages
    sessionStorage.setItem('successMessage', successMessage.value) 

    // Redirige vers la page d'accueil après soumission
    router.push('/')
  } catch (error) {
    // Si l'API retourne une erreur de validation (code 422), on stocke les erreurs de chaque champ
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    } else {
      // Pour toute autre erreur, on affiche un message d'erreur générique
      errorMessage.value = 'Une erreur est survenue lors de la soumission de l\'annonce.'
    }

    // On vide le message de succès dans tous les cas d'échec
    successMessage.value = '' 
  }
}
</script>
