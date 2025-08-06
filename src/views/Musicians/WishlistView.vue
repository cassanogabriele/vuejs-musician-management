<template>
  <div class="container mt-5">
    <h2 class="title">Vos listes de souhaits</h2>

    <div class="alert alert-success alert-dismissible fade show" v-if="alertMessage" role="alert">
      <strong>{{ alertMessage }}</strong>
      <button type="button" class="btn-close" @click="alertMessage = ''"></button>
    </div>

    <!-- Si l'utilisateur n'a pas de wishlist -->
    <div v-if="wishlists.length === 0" class="mb-3">
      <div class="alert alert-info" role="alert">
        Vous n'avez pas encore de liste de souhaits.
      </div>
    </div>

    <!-- Si l'utilisateur a des wishlists -->
    <div v-else class="mb-3">
      <div v-for="wishlist in wishlists" :key="wishlist.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ wishlist.name }}</h5>

          <ul class="list-group list-group-flush mt-3" v-if="wishlist.musicians.length > 0">
            <li v-for="musician in wishlist.musicians" :key="musician.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ musician.name }}</strong> - {{ musician.style }}  
                <br />
                <small>{{ musician.email }} - {{ musician.phone }}</small>
              </div>
              <button class="btn btn-link p-0 text-danger" @click="removeMusician(wishlist.id, musician.id)">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </li>
          </ul>
          <div v-else class="text-muted mt-2">Aucun musicien dans cette liste.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      wishlists: [],
      alertMessage: '',
      // apiUrl: 'http://localhost:8000/api', 
      apiUrl: 'http://musicianmanagement.gabriel-cassano.be/api', 
    };
  },
  mounted() {
    const wishlistId = this.$route.params.id
    this.fetchWishlists()
  },
  methods: {
    fetchWishlists() {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        console.error("Utilisateur non connecté");
        return;
      }

      const userObject = JSON.parse(storedUser);
      const userId = userObject.id;

      // Envoie l'ID de l'utilisateur directement dans l'URL
      axios.get(`${this.apiUrl}/wishlists/${userId}`)
        .then((res) => {
          this.wishlists = res.data;
          console.log(this.wishlists);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des wishlists", error);
          if (error.response && error.response.data && error.response.data.message) {
            this.alertMessage = `Erreur: ${error.response.data.message}`;
          } else {
            this.alertMessage = "Erreur lors de la récupération des wishlists. Veuillez réessayer.";
          }
        });
    },
    removeMusician(wishlistId, musicianId) {
      if (!confirm("Tu veux vraiment supprimer ce musicien de la wishlist ?")) return;

      axios.delete(`${this.apiUrl}/wishlist/${wishlistId}/musician/${musicianId}`)
        .then((response) => {
          // Assurez-vous que la réponse contient des données qui incluent 'musicianName' 
          this.alertMessage = `Le musicien ${response.data.musicianName} a été supprimé de la wishlist avec succès.`;
          
          this.fetchWishlists(); // refresh
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du musicien", error);
          this.alertMessage = "Erreur lors de la suppression du musicien.";
        });
    }
  }
}
</script>
