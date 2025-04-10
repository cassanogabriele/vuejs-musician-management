<template>
  <div class="container mt-5">
    <h2 class="title">Création d'une nouvelle liste de souhaits</h2>

    <div class="alert alert-success alert-dismissible fade show" v-if="alertMessage" role="alert">
      <strong>{{ alertMessage }}</strong>
      <button type="button" class="btn-close" @click="alertMessage = ''"></button>
    </div>

    <!-- Si l'utilisateur n'a pas de wishlist ou souhaite en créer une nouvelle -->
    <div v-if="wishlists.length === 0 || !selectedWishlistId" class="mb-3">
      <label for="newWishlist" class="form-label">Nom de la nouvelle liste de souhaits :</label>
      <input
        type="text"
        id="newWishlist"
        class="form-control"
        v-model="newWishlistName"
        required
      />
      <button type="submit" class="btn btn-primary mt-2" @click="createNewWishlist">Créer</button>
    </div>

    <!-- Si des wishlists existent déjà -->
    <div v-if="wishlists.length > 0" class="mb-3">
      <form @submit.prevent="handleSubmit">
        <label for="wishlist" class="form-label">Choisissez une wishlist :</label>
        <select v-model="selectedWishlistId" id="wishlist" class="form-select" required>
          <option value="" disabled selected>Choisissez une wishlist</option>
          <option v-for="wishlist in wishlists" :key="wishlist.id" :value="wishlist.id">
            {{ wishlist.name }}
          </option>
        </select>

        <button type="submit" class="btn btn-primary mt-2">Ajouter à la wishlist</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      wishlists: [],
      selectedWishlistId: null,
      newWishlistName: '',
      alertMessage: '',
      musicianId: null, // ✅ Initialisé ici au lieu de l'utiliser mal dans mounted()
      apiUrl: 'http://127.0.0.1:8000/api',
    };
  },
  mounted() {
    // ✅ Récupérer l'ID du musicien depuis les paramètres de la route
    this.musicianId = this.$route.params.id; // Correction ici
    
    // Récupérer les wishlists existantes de l'utilisateur
    this.fetchWishlists();
  },
  methods: {
    fetchWishlists() {
      axios.get(`${this.apiUrl}/wishlists`)
        .then((res) => {
          this.wishlists = res.data;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des wishlists", error);
        });
    },

    handleSubmit() {
      if (this.selectedWishlistId) {
        this.addMusicianToWishlist(this.musicianId, this.selectedWishlistId);
      } else if (this.newWishlistName) {
        this.createNewWishlist();
      }
    },

    addMusicianToWishlist(musicianId, wishlistId) {
      axios.post(`${this.apiUrl}/wishlist/add-musician`, {
        musician_id: musicianId, // ✅ Correction ici
        wishlist_id: wishlistId,
      }).then(() => {
        this.alertMessage = 'Musicien ajouté à la wishlist!';
      }).catch((error) => {
        console.error("Erreur lors de l'ajout du musicien", error);
      });
    },

    createNewWishlist() {
      alert(this.musicianId);
      if (!this.newWishlistName) {
        this.alertMessage = 'Veuillez entrer un nom pour la wishlist.';
        return;
      }

      // ✅ Récupérer correctement l'utilisateur depuis le localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        this.alertMessage = "Erreur : utilisateur non connecté.";
        return;
      }
      const userObject = JSON.parse(storedUser);
      const user_id = userObject.id;

      axios.post(`${this.apiUrl}/wishlist`, {
        name: this.newWishlistName,          
        musician_id: this.musicianId, 
        user_id: user_id, 
      }).then(() => {
        this.alertMessage = 'Nouvelle wishlist créée et musicien ajouté!';
        this.newWishlistName = '';  
        this.fetchWishlists();  
      }).catch((error) => {
        console.error("Erreur lors de la création de la wishlist", error);
        this.alertMessage = "Erreur lors de la création de la wishlist. Veuillez réessayer.";
      });
    },
  },
};
</script>
