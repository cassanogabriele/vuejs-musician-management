<template>
  <div>
    <h3>Wishlist : {{ wishlist.name }}</h3>
    <ul>
      <li v-for="musician in wishlist.musicians" :key="musician.id">
        {{ musician.name }} - {{ musician.style }}
      </li>
    </ul>
    <router-link :to="'/musicians'">Retour à la liste des musiciens</router-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      wishlist: {},
    }
  },
  mounted() {
    const wishlistId = this.$route.params.id
    this.getWishlist(wishlistId)
  },
  methods: {
    getWishlist(id) {
      axios.get(`http://127.0.0.1:8000/api/wishlist/${id}`)
        .then((res) => {
          this.wishlist = res.data
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de la wishlist", error)
        })
    }
  }
}
</script>
