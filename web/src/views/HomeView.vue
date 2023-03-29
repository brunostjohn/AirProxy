<script lang="ts">
import DevicePicker from '../components/DevicePicker.vue'

export default {
  components : {
    DevicePicker
  }
}
</script>

<template>
  <main>
    <h1>Welcome to the AirProxy dashboard.</h1>
    <hr />
    <DevicePicker />
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/home.scss'
</style>