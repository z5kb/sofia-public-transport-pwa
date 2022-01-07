<template>
    <div id="navbar-component">
        <div id="navbar">
            <img v-on:click="renderStopComponent()" class="navbar-icon" alt="search-icon" src="../assets/navigation-bar/search@48x48.svg">
            <img v-on:click="renderFavouritesComponent()" class="navbar-icon" alt="favourite-icon" src="../assets/navigation-bar/favourite-heart@48x48.svg">
            <img class="navbar-icon" alt="bus-icon" src="../assets/navigation-bar/bus@48x48.svg">
            <img class="navbar-icon" alt="alerts-icon" src="../assets/navigation-bar/alerts@48x48.svg">
            <img class="navbar-icon" alt="settings-icon" src="../assets/navigation-bar/settings@48x48.svg">
        </div>
        <Stop v-if="stopIsActive"></Stop>
        <Favourites v-if="favouritesIsActive"></Favourites>
    </div>
</template>

<script>
import Stop from "./Stop.vue"
import Favourites from "./Favourites.vue"

export default {
    name: "NavigationBar",
    components: {
        Stop,
        Favourites,
    },
    data() {
        return {
            stopIsActive: true,
            favouritesIsActive: false,
        }
    },
    methods: {
        renderStopComponent: function () {
            this.clearRenderedComponents()
            this.stopIsActive = !this.stopIsActive
        },
        renderFavouritesComponent: function () {
            this.clearRenderedComponents()
            this.favouritesIsActive = !this.favouritesIsActive
        },
        clearRenderedComponents: function () {
            this.stopIsActive = false
            this.favouritesIsActive = false
        }
    }
}

</script>

<style scoped>
#navbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
}

.navbar-icon {
    width: 3rem;
    height: 3rem;
}
</style>