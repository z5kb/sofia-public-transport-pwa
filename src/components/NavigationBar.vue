<template>
    <div id="navbar-component">
        <div id="navbar">
            <img @click="renderStopComponent()" class="navbar-icon" alt="search-icon" src="../assets/navigation-bar/search@48x48.svg">
            <img @click="renderFavouritesComponent()" class="navbar-icon" alt="favourite-icon" src="../assets/navigation-bar/favourite-heart@48x48.svg">
            <img @click="renderLinesComponent()" class="navbar-icon" alt="bus-icon" src="../assets/navigation-bar/bus@48x48.svg">
            <img class="navbar-icon" alt="alerts-icon" src="../assets/navigation-bar/alerts@48x48.svg">
            <img class="navbar-icon" alt="settings-icon" src="../assets/navigation-bar/settings@48x48.svg">
        </div>
        <Stop v-if="stopIsActive" v-bind:stopIdFromLinesComponent="stopId"></Stop>
        <Favourites v-if="favouritesIsActive"></Favourites>
        <Lines v-if="linesIsActive" @load-stop="loadStop"></Lines>
    </div>
</template>

<script>
import Stop from "./Stop.vue"
import Favourites from "./Favourites.vue"
import Lines from "./Lines"

export default {
    name: "NavigationBar",
    components: {
        Stop,
        Favourites,
        Lines
    },
    data() {
        return {
            stopIsActive: true,
            stopId: null,
            favouritesIsActive: false,
            linesIsActive: false,
        }
    },
    methods: {
        loadStop: function (stopId) {
            this.renderStopComponent()
            this.stopId = stopId[1]
        },
        renderStopComponent: function () {
            this.clearRenderedComponents()
            this.stopIsActive = !this.stopIsActive
        },
        renderFavouritesComponent: function () {
            this.clearRenderedComponents()
            this.favouritesIsActive = !this.favouritesIsActive
        },
        renderLinesComponent: function () {
            this.clearRenderedComponents()
            this.linesIsActive = !this.linesIsActive
        },
        clearRenderedComponents: function () {
            this.stopIsActive = false
            this.favouritesIsActive = false
            this.linesIsActive = false
        }
    }
}

</script>

<style scoped>
#navbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    min-width: 22rem;
    max-width: 30rem;
    margin: auto;
}

.navbar-icon {
    width: 3rem;
    height: 3rem;
}
</style>