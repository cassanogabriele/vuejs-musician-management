<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h4>Modifier un musicien</h4>
            </div>
          
            <div class="card-body">
                <!-- Affichage du message de confirmation d'édition -->
                <div class="alert alert-success alert-dismissible fade show" v-if="alertMessage" role="alert">
                    <strong><span class="text-center">{{ alertMessage }}</span></strong>
                                    
                    <div class="progress mt-2" style="height: 5px;">
                        <div
                            class="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style="width: 100%;"
                        ></div>
                    </div>
                </div>

                <!-- Messages d'erreur venant de Laravel -->
                <ul class="alert alert-danger alert-dismissible fade show" v-if="Object.keys(this.errorList).length > 0">
                    <li class="mb-0 ms-3" v-for="(error, index) in this.errorList" :key="index">
                        {{ error[0] }}
                    </li>
                    <!-- La croix pour fermer l'alerte d'erreur -->
                    <button type="button" class="btn-close" aria-label="Close" @click="closeErrorAlert"></button>
                </ul>

                <div class="mb-3">
                    <label for="Name">Nom</label>
                    <input type="text" v-model="model.musician.name" class="form-control"/>
                </div>

                <div class="mb-3">
                    <label for="Style">Style</label>
                    <input type="text" v-model="model.musician.style" class="form-control"/>
                </div>

                <div class="mb-3">
                    <label for="Email">Email</label>
                    <input type="email" v-model="model.musician.email" class="form-control"/>
                </div>

                <div class="mb-3">
                    <label for="Phone">Téléphone</label>
                    <input type="tel" v-model="model.musician.phone" class="form-control"/>
                </div>

                <div class="mb-3">
                    <button type="button" @click="editMusician" class="btn btn-primary"><font-awesome-icon :icon="['fas', 'edit']" /> Modifier</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'musicianEdit',
    data() {
        return {
            musicianId: '',
            // Liste des erreurs venant de Laravel
            errorList: '', 
            alertMessage: '', 
            apiUrl: 'http://127.0.0.1:8000/api',
            // apiUrl: 'http://musicianmanagement.gabriel-cassano.be/api',
            model: {
                musician: {
                    name: '',
                    style: '',
                    email: '',
                    phone: ''
                }
            }
        };
    },
    mounted(){
        this.musicianId = parseInt(this.$route.params.id, 10); 
        this.getMusicianData(this.$route.params.id);
    },
    methods: {
        // Récupérer les infos du musicien qu'on va mettre à jour
       getMusicianData(musicianId) {
            musicianId = parseInt(musicianId, 10);          
             
            axios.get(`${this.apiUrl}/musicians/${this.musicianId}/edit`)
                .then(res => {
                    this.model.musician.name = res.data.musician.name;
                    this.model.musician.style = res.data.musician.style;
                    this.model.musician.email = res.data.musician.email;
                    this.model.musician.phone = res.data.musician.phone;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données du musicien:', error);
                });
        },
        editMusician(musicianId) {
            var mythis = this;

            // Utiliser les backticks pour l'interpolation de la chaîne
           axios.put(`${this.apiUrl}/musicians/${this.musicianId}`, this.model.musician)
                .then(res => {
                    // Si la mise à jour est réussie
                    this.alertMessage = res.data.message || 'Musicien mis à jour avec succès'; 
                
                    // Redirection vers la page des musiciens après un délai
                    setTimeout(() => {
                        this.$router.push('/my-announces');
                    }, 3000);
                })
                .catch(function (error) {
                    if (error.response) {
                        if (error.response.status == 422) {
                            mythis.errorList = error.response.data.errors;
                        }

                        if (error.response.status == 404) {
                            alert(error.response.data.message);
                            mythis.errorList = error.response.data.errors;
                        }
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                });
        }
    }
}
</script>


