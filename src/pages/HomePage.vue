<template>
  <SearchProducts />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchProducts from './SearchProducts.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    SearchProducts
  }
})
</script>

<style scoped></style>
