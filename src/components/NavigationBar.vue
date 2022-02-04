<template>
    <div id="navbar-component">
        <div id="navbar">
            <img @click="renderStopComponent()" class="navbarIcon" alt="search-icon" src="../assets/navigation-bar/search@48x48.svg">
            <img @click="renderFavouritesComponent()" class="navbarIcon" alt="favourite-icon" src="../assets/navigation-bar/favourite-heart@48x48.svg">
            <img @click="renderLinesComponent()" class="navbarIcon" alt="bus-icon" src="../assets/navigation-bar/bus@48x48.svg">
            <img @click="renderChangesComponent()" class="navbarIcon" alt="alerts-icon" src="../assets/navigation-bar/alerts@48x48.svg">
            <img class="navbarIcon" alt="settings-icon" src="../assets/navigation-bar/settings@48x48.svg">
        </div>
        <Stop v-if="stopIsActive" v-bind:stopCodeFromAnotherComponent="stopId"></Stop>
        <Favourites v-if="favouritesIsActive" @load-stop="loadStop"></Favourites>
        <Lines v-if="linesIsActive" @load-stop="loadStop"></Lines>
        <Changes v-if="changesIsActive"></Changes>
    </div>
</template>

<script>
import Stop from "./Stop.vue"
import Favourites from "./Favourites.vue"
import Lines from "./Lines"
import Changes from "./ChangesInRoutes.vue"

export default {
    name: "NavigationBar",
    components: {
        Stop,
        Favourites,
        Lines,
        Changes
    },
    data() {
        return {
            stopIsActive: true,
            stopId: null,
            favouritesIsActive: false,
            linesIsActive: false,
            changesIsActive: false,
        }
    },
    methods: {
        loadStop: function (stopId) {
            console.log(typeof stopId)
            this.renderStopComponent()
            this.stopId = stopId
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
        renderChangesComponent: function () {
            this.clearRenderedComponents()
            this.changesIsActive = !this.changesIsActive
        },
        clearRenderedComponents: function () {
            this.stopIsActive = false
            this.favouritesIsActive = false
            this.linesIsActive = false
            this.changesIsActive = false
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

.navbarIcon {
    width: 3rem;
    height: 3rem;
}
</style>