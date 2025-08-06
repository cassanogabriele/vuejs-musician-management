<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4 class="d-flex justify-content-between align-items-center">
          Musiciens
          <RouterLink to="/musicians/announce" class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </RouterLink>
        </h4>
      </div>

      <!-- Message de succès -->
      <div class="alert alert-success alert-dismissible fade show" v-if="alertMessage" role="alert">
        <strong>{{ alertMessage }}</strong>
        <button type="button" class="btn-close" @click="alertMessage = ''"></button>
      </div>

      <div class="card-body">      
        <table class="table table-bordered d-none d-sm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Styles</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Inscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody v-if="musicians.length > 0">
            <tr v-for="(musician, index) in musicians" :key="index">
              <td>{{ musician.id }}</td>
              <td>{{ musician.name }}</td>
              <td>{{ musician.style }}</td>
              <td>{{ musician.email }}</td>
              <td>{{ musician.phone }}</td>
              <td v-html="formatDate(musician.created_at)"></td>
              <td>
               <button @click="toggleWishlist(musician.id)" class="btn btn-sm">
                <font-awesome-icon :icon="['fas', 'heart']" style="color: #DAA520;" />
               </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7">Chargement ...</td>
            </tr>
          </tbody>
        </table>   
        <!-- Pour les petits écrans -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 d-block d-sm-none">
          <div class="col" v-for="(musician, index) in musicians" :key="index">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ musician.name }}</h5>
                <p><strong>ID:</strong> {{ musician.id }}</p>
                <p><strong>Styles:</strong> {{ musician.style }}</p>
                <p><strong>Email:</strong> {{ musician.email }}</p>
                <p><strong>Téléphone:</strong> {{ musician.phone }}</p>
                <p><strong>Inscription :</strong> Le <span v-html="formatDate(musician.created_at)"></span></p>                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      musicians: [],
      alertMessage: '',
      styleFilter: this.$route.query.style || '',
      newWishlistName: '',
      showWishlistForm: false,
      // apiUrl: 'http://127.0.0.1:8000/api',
      apiUrl: 'http://musicianmanagement.gabriel-cassano.be/api',
    };
  },
  mounted() {
    this.getMusicians();
  },
  methods: {
    getMusicians() {
      const url = this.styleFilter
        ? `${this.apiUrl}/musicians?style=${this.styleFilter}`
        : `${this.apiUrl}/musicians`;

      axios.get(url).then(res => {
        this.musicians = res.data.musicians;
      });
    },

    toggleWishlist(musicianId) {
      // Vérifier si l'utilisateur a déjà des wishlists
      axios.get(`${this.apiUrl}/wishlists`).then(res => {
        const wishlists = res.data;

        if (wishlists.length === 0) {
          // Si l'utilisateur n'a pas de wishlist, on le redirige vers la page de création
          this.$router.push({ name: 'create-wishlist', params: { musicianId: musicianId } });
        } else {
          // Si l'utilisateur a des wishlists, on lui permet de les choisir ou de créer une nouvelle
          this.selectedWishlistId = wishlists[0].id; // Par exemple, on sélectionne la première wishlist
          this.addMusicianToWishlist(musicianId, this.selectedWishlistId);
        }
      }).catch(error => {
        console.error("Erreur lors de la récupération des wishlists", error);
      });
    },  
    toggleWishlist(musicianId) {      
      // Vérifier si l'utilisateur a déjà des wishlists
      axios.get(`${this.apiUrl}/wishlists`).then(res => {
        const wishlists = res.data;

        // Rediriger vers la page de création de wishlist avec l'ID du musicien
        this.$router.push({ name: 'create-wishlist', params: { id: musicianId } });
      }).catch(error => {
        console.error("Erreur lors de la récupération des wishlists", error);
      });
    },
    formatDate(date) {
      const newDate = new Date(date);
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return newDate.toLocaleDateString('fr-FR', options);
    },
  },
};
</script>
