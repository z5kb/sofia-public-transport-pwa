<template>
    <NavigationBar></NavigationBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import NavigationBar from "./components/NavigationBar.vue";

export default defineComponent({
    name: "App",
    components: {
        NavigationBar
    }
});

</script>

<style>
</style>
