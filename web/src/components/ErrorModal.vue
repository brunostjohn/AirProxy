<script lang="ts">
import type { StyleValue } from 'vue';

export default {
    props: ['errorContent', 'visibility'],
    computed: {
        visible() : StyleValue{
            const add = this.visibility ? 'visible':'hidden'
            return `visibility: ${add};`;
        }
    },
}
</script>

<template>
<div id="modalContainer" :style="visibility">
    <div id="modalItself">  
        <h2>Error</h2>
        <hr />
        <p :key="errorContent">{{ errorContent }}</p>
    </div>
</div>
</template>

<style scoped lang="scss">
@import '../styles/error.scss';
</style>
