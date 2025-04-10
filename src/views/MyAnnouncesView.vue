<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h4 class="d-flex justify-content-between align-items-center">
          Vos annonces
          <RouterLink to="/musicians/create" class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </RouterLink>
        </h4>
      </div>

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
            
              <td class="d-flex gap-1">
                <RouterLink :to="{ path: `/musicians/${musician.id}/edit` }" class="btn btn-success btn-sm">
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </RouterLink>

                <button type="button" @click="deleteMusician(musician.id)" class="btn btn-danger btn-sm">
                  <font-awesome-icon :icon="['fas', 'trash']" />
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
                <div>
                  <RouterLink :to="{ path: `/musicians/${musician.id}/edit` }" class="btn btn-success btn-sm">
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </RouterLink>

                  <button type="button" @click="deleteMusician(musician.id)" class="btn btn-danger btn-sm">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
      musicians: [],
      loading: true,
      alertMessage: '',
      apiUrl: 'http://127.0.0.1:8000/api',
      // apiUrl: 'http://musicianmanagement.gabriel-cassano.be/api',
    };
  },
  mounted() {
    this.getAnnouncesOfUser();
  },
  methods: {
    async getAnnouncesOfUser() {
      try {
        // Récupérer des informations de l'utilisateur dans le localStorage
        const storedUser = localStorage.getItem('user');
        const userObject = JSON.parse(storedUser); 
        const userId = userObject.id;        

        const response = await axios.get(`${this.apiUrl}/announces`, { 
          params: {
            user_id: userId, 
          }
        });

        this.musicians = response.data.musicians;
      } catch (error) {
        console.error('Erreur lors de la récupération des musiciens:', error);
      } finally {
        this.loading = false;
      }
    },
     formatDate(date) {
      const newDate = new Date(date);
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return newDate.toLocaleDateString('fr-FR', options);
    },
    deleteMusician(musicianId) {
      if (confirm('Etes-vous sûr de supprimer le musicien ?')) {
        // Utilisation de apiUrl pour créer le chemin complet
        const url = `${this.apiUrl}/api/musicians/${parseInt(musicianId, 10)}/delete`;

        axios.delete(url)
          .then(res => {
            this.alertMessage = res.data.message || 'Le musicien a été supprimé avec succès';

            setTimeout(() => {
              this.alertMessage = '';
            }, 4000);

            this.getAnnouncesOfUser(); 
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              alert(error.response.data.message);
            } else {
              console.log('Error', error.message);
            }
          });
      }
    }
  }
};
</script>

