<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTheme } from './composables/useTheme'

export default defineComponent({
  name: 'App',
  setup() {
    useTheme()
    return {}
  }
})
</script>

<style></style>
