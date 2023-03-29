<script lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ErrorModal from './components/ErrorModal.vue'
export default {
  components: {
    ErrorModal,
    RouterView,
    NavBar
  },
  data(){
    return {
      visibility: `visibility: hidden;`,
      errorContent: 'Cannot connect to API server. Please check your Docker configuration.',
      alive: setInterval(()=>{})
    }
  },
  computed:{
  },
  created(){
     this.alive = setInterval(this.checkServerConnectivity.bind(this), 1000)
  },
  methods: {
    returnErrContent(){
      return this.errorContent
    },

    checkServerConnectivity() {
      let xhr = new XMLHttpRequest()
      xhr.timeout = 10
        xhr.open('GET', 'http://127.0.0.1:8008/ping', true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        xhr.ontimeout = (e) => {
          this.visibility = `visibility: visible;`;
        }
        try{
          xhr.send()
        } catch {
          this.visibility = `visibility: visible;`;
          return
        }
        xhr.onload = () => {
          if (xhr.status != 200){
            this.visibility = `visibility: visible;`;
          } else {
            this.visibility = `visibility: hidden;`;
          }
        }
    },

    stopUpdating(){
      clearInterval(this.alive)
    }
  }
}
</script>

<template>
  <KeepAlive>
    <ErrorModal :errorContent="errorContent" :visibility="visibility" />
  </KeepAlive>
  <NavBar />
  <RouterView />
</template>
