<template>
    <div id="navbar-component">
        <div id="sidebar" :style="'width: ' + sidebarWidth + ';'">
            something
            something
            something
            something
            something
            something
            something
            something
            something
            something
            something
            <img @click="toggleSidebar()" src="../assets/images/remove.svg" style="width: 2rem; height: 2rem" alt="close-icon">
        </div>

        <div id="burgerMenu">
            <svg @click="toggleSidebar()" viewBox="0 0 100 80" width="40" height="40">
                <rect width="100" height="13" rx="8"></rect>
                <rect y="30" width="100" height="13" rx="8"></rect>
                <rect y="60" width="100" height="13" rx="8"></rect>
            </svg>
        </div>
        <div id="navbar">
            <div @click="renderStopComponent()" :class="renderStopComponentStyle" class="navbarTab">
                Search
            </div>
            <div @click="renderFavouritesComponent()" :class="renderFavouritesComponentStyle" class="navbarTab">
                Favourites
            </div>
            <div @click="renderLinesComponent()" :class="renderLinesComponentStyle" class="navbarTab">
                Lines
            </div>
            <div @click="renderChangesComponent()" :class="renderChangesComponentStyle" class="navbarTab">
                Changes
            </div>
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
            renderStopComponentStyle: null,
            favouritesIsActive: false,
            renderFavouritesComponentStyle: null,
            linesIsActive: false,
            renderLinesComponentStyle: null,
            changesIsActive: false,
            renderChangesComponentStyle: null,
            stopId: null,
            sidebarWidth: "0px",
        }
    },
    mounted() {
        this.renderStopComponent()
    },
    methods: {
        loadStop: function (stopId) {
            this.renderStopComponent()
            this.stopId = stopId
        },
        toggleSidebar: function () {
            if (this.sidebarWidth === "0px") {
                this.sidebarWidth = "250px"
            } else {
                this.sidebarWidth = "0px"
            }
        },
        renderStopComponent: function () {
            this.clearRenderedComponents()
            this.renderStopComponentStyle = "currNavbarTab"
            this.stopIsActive = !this.stopIsActive
        },
        renderFavouritesComponent: function () {
            this.clearRenderedComponents()
            this.renderFavouritesComponentStyle = "currNavbarTab"
            this.favouritesIsActive = !this.favouritesIsActive
        },
        renderLinesComponent: function () {
            this.clearRenderedComponents()
            this.renderLinesComponentStyle = "currNavbarTab"
            this.linesIsActive = !this.linesIsActive
        },
        renderChangesComponent: function () {
            this.clearRenderedComponents()
            this.renderChangesComponentStyle = "currNavbarTab"
            this.changesIsActive = !this.changesIsActive
        },
        clearRenderedComponents: function () {
            this.stopIsActive = false
            this.favouritesIsActive = false
            this.linesIsActive = false
            this.changesIsActive = false

            this.renderStopComponentStyle = null
            this.renderFavouritesComponentStyle = null
            this.renderLinesComponentStyle = null
            this.renderChangesComponentStyle = null
        }
    }
}

</script>

<style scoped>
@import "../assets/colors.css";

#sidebar {
    display: flex;
    justify-content: space-between;
    position: fixed;
    height: 100%;
    width: 0;
    top: 0;
    left: 0;
    background: lightblue;
    overflow-x: hidden;
    transition: 0.5s;
}

#navbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    max-width: 30rem;
    margin: auto;
}

.navbarTab {
    padding: 1rem;
    user-select: none;
}

.currNavbarTab {
    border-bottom: 5px solid var(--color-accent-800);
    border-radius: 4px;
}
</style>