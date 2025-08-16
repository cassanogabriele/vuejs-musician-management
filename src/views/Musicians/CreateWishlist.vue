<template>
  <div class="container mt-5">
    <h2 class="title">Création d'une nouvelle liste de souhaits</h2>

    <div class="alert alert-success alert-dismissible fade show" v-if="alertMessage" role="alert">
      <strong>{{ alertMessage }}</strong>
      <button type="button" class="btn-close" @click="alertMessage = ''"></button>
    </div>

    <!-- Si l'utilisateur n'a pas de liste de souhaits -->
    <div v-if="wishlists.length === 0" class="mb-3">
      <label for="newWishlist" class="form-label">Nom de la nouvelle liste de souhaits :</label>
      <input
        type="text"
        id="newWishlist"
        class="form-control"
        v-model="newWishlistName"
        required
      />
      <button type="button" class="btn btn-primary mt-2" @click="createNewWishlist">Créer</button>
    </div>

    <!-- Si l'utilisateur a des listes de souhaits -->
    <div v-else class="mb-3">
      <form @submit.prevent="handleSubmit">
        <label for="wishlist" class="form-label">Choisissez une lise de souhaits :</label>
        <select v-model="selectedWishlistId" id="wishlist" class="form-select" required>
          <option value="" disabled selected>Choisissez une liste de souhaits</option>
          <option v-for="wishlist in wishlists" :key="wishlist.id" :value="wishlist.id">
            {{ wishlist.name }}
          </option>
        </select>

        <button type="submit" class="btn btn-primary mt-2">Ajouter à la liste de souhaits</button>
      </form>

      <!-- Si aucune wishlist n'est sélectionnée, possibilité de créer une nouvelle liste de souhaits -->
      <div v-if="!selectedWishlistId" class="mt-3">
        <label for="newWishlist" class="form-label">Nom de la nouvelle liste de souhaits :</label>
        <input
          type="text"
          id="newWishlist"
          class="form-control"
          v-model="newWishlistName"
          required
        />
        <button type="button" class="btn btn-primary mt-2" @click="createNewWishlist">Créer</button>
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
      selectedWishlistId: null,
      newWishlistName: '',
      alertMessage: '',
      // apiUrl: 'http://127.0.0.1:8000/api',
      apiUrl : 'http://musicianmanagement.gabriel-cassano.be/api',
      musicianId: null,
    };
  },
  mounted() {
     // Récupérer l'ID du musicien depuis les paramètres de la route
    this.musicianId = this.$route.params.id;
    
    // Récupérer les wishlists existantes de l'utilisateur
    this.fetchWishlists();
  },
  methods: {
    // Création d'une nouvelle wishlist
    createNewWishlist() {
      if (!this.newWishlistName) {
        this.alertMessage = "Veuillez entrer un nom pour la liste de souhaits";
        return;
      }

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        this.alertMessage = "Erreur : utilisateur non connecté";
        return;
      }

      const userObject = JSON.parse(storedUser);
      const user_id = userObject.id;

      axios.post(`${this.apiUrl}/wishlist`, {
        name: this.newWishlistName,
        musician_id: this.musicianId,
        user_id: user_id,
      })
      .then(() => {
        this.alertMessage = 'Nouvelle liste de souhaits créée et musicien ajouté !';
        this.newWishlistName = '';
        this.fetchWishlists(); // Recharge la liste après création
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la wishlist", error);
        this.alertMessage = "Erreur lors de la création de la wishlist. Veuillez réessayer.";
      });
    },

    // Récupérer les wishlists de l'utilisateur
    fetchWishlists() {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        console.error("Utilisateur non connecté");
        return;
      }

      const userObject = JSON.parse(storedUser);
      const userId = userObject.id;

      axios.get(`${this.apiUrl}/wishlists/${userId}`)
        .then((res) => {
          this.wishlists = res.data;
          console.log("Wishlists de l'utilisateur :", this.wishlists);
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

    // Soumission du formulaire pour ajouter le musicien à la wishlist sélectionnée
    handleSubmit() {
      if (!this.selectedWishlistId) {
        this.alertMessage = "Veuillez choisir une wishlist";
        return;
      }
      this.addMusicianToWishlist(this.musicianId, this.selectedWishlistId);
    },

    // Ajoute un musicien à une wishlist
    addMusicianToWishlist(musicianId, wishlistId) {
      console.log("Ajout musicien", musicianId, "à la wishlist", wishlistId);

      axios.post(`${this.apiUrl}/wishlist/add-musician`, {
        musician_id: musicianId,
        wishlist_id: wishlistId,
      })
      .then(() => {
        this.alertMessage = 'Musicien ajouté à la liste de souhaits';
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du musicien", error);
        this.alertMessage = "Erreur lors de l'ajout du musicien. Veuillez réessayer.";
      });
    },
  }
}
</script>
