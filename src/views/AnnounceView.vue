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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// Initialisation du router et des variables
const router = useRouter()
const isLoggedIn = ref(false)
const user = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref({})
const apiUrl = 'http://127.0.0.1:8000/api';

const announcement = ref({
  name: '',
  style: '',
  email: '',
  phone: '',
  userid: '',
})

// Vérifier l'état de l'utilisateur connecté
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isLoggedIn.value = true
  }
})

// Soumettre l'annonce
const submitAnnouncement = async () => {
  // Réinitialiser les erreurs
  errors.value = {}
  errorMessage.value = ''

  if (!isLoggedIn.value) {
    errorMessage.value = 'Vous devez être connecté pour soumettre une annonce.'
    return
  }

  try {
    // Récupérer l'id utilisateur
    const storedUser = localStorage.getItem('user')
    const userObject = JSON.parse(storedUser); 
    const user_id =  userObject.id;
    
    // Envoi des données à l'API
    const response = await axios.post(`${apiUrl}/announcements`, {
      name: announcement.value.name,
      style: announcement.value.style,
      email: announcement.value.email,
      phone: announcement.value.phone,
      userId: user_id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    errorMessage.value = '' 

    window.dispatchEvent(new Event('userUpdated'))

    successMessage.value = 'Le musicien a été ajouté !'
    sessionStorage.setItem('successMessage', successMessage.value)

    router.push('/')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Capture des erreurs spécifiques à chaque champ
      errors.value = error.response.data.errors
    } else {
      errorMessage.value = 'Une erreur est survenue lors de la soumission de l\'annonce.'
    }
    successMessage.value = '' 
  }
}
</script>
