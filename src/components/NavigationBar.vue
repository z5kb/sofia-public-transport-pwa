<template>
    <div id="navbar-component">
        <div id="sidebar" :style="'width: ' + sidebarWidth + ';'">
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h2>Светла/тъмна тема</h2>
                <label class="switch">
                    <input type="checkbox" v-model="darkThemeIsActive">
                    <span class="slider round"></span>
                </label>
            </div>
            <h2>За приложението</h2>
            <a style="padding: 0 1rem 0 1rem;">
                Това приложение бе направено като дипломна работа. Не съдържа реклами, не събира абсолютно никаква
                информация от потребителя и е напълно безплатно. За повече информация, моля посетете
                <a href="https://github.com/z5kb/sofia-public-transport-pwa" target="_blank" style="color: var(--color-href)">страницата на проекта</a>.
            </a>
            <span id="toggleSidebarImg" @click="toggleSidebar()"></span>
        </div>
        <span id="burgerMenuIcon" @click="toggleSidebar()"></span>
        <div id="navbar">
            <div @click="renderStopComponent()" :class="renderStopComponentStyle" class="navbarTab">
                Търсене
            </div>
            <div @click="renderFavouritesComponent()" :class="renderFavouritesComponentStyle" class="navbarTab">
                Любими
            </div>
            <div @click="renderLinesComponent()" :class="renderLinesComponentStyle" class="navbarTab">
                Линии
            </div>
            <div @click="renderChangesComponent()" :class="renderChangesComponentStyle" class="navbarTab">
                Промени
            </div>
        </div>
        <Stop v-if="stopIsActive" v-bind:stopCodeFromAnotherComponent="stopId"></Stop>
        <Favourites v-if="favouritesIsActive" @load-stop="loadStop"></Favourites>
        <Lines v-if="linesIsActive" @load-stop="loadStop"></Lines>
        <Changes v-if="changesIsActive"></Changes>
    </div>
</template>

<script>
// an IndexedDB library
import Localbase from "localbase"

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

            db: new Localbase("db"),
            stopId: null,
            sidebarWidth: "0px",
            darkThemeIsActive: false,
        }
    },
    mounted() {
        // render the default component
        this.renderStopComponent()

        // load the latest theme
        this.db.collection("Theme").get().then(data => {
            if (data.length === 0) {
                // init theme
                this.db.collection("Theme").add({
                    latestThemeWasDark: false,
                }).then(() => this.darkThemeIsActive = false)
            } else {
                // set curr theme
                this.darkThemeIsActive = data[0]["latestThemeWasDark"]
            }
        })
    },
    watch: {
        darkThemeIsActive: function (newVal, oldVal) {
            // if oldVal is null, darkThemeIsActive is up-to-date (has just been initialized)
            if (oldVal !== null) {
                // update the DB and toggle the theme
                this.db.collection("Theme").set([{
                    latestThemeWasDark: newVal
                }])
                document.body.classList.toggle("dark-theme")
            }
        }
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
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    height: 100%;
    width: 0;
    top: 0;
    left: 0;
    background: var(--color-neutral-100);
    box-shadow: 0 3px 5px var(--color-shadows);
    overflow-x: hidden;
    transition: 0.3s;
    z-index: 1;
}

#burgerMenuIcon {
    display: block;
    mask: url("../assets/images/menu_black_18px.svg");
    background: var(--color-main-text);
    width: 48px;
    height: 48px;
}

#toggleSidebarImg {
    mask: url("../assets/images/close_black_18px.svg");
    background: var(--color-main-text);
    width: 36px;
    height: 36px;
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    transition: 0.5s;
}

h2 {
    font-size: 20px;
    font-weight: bold;
    padding: 1.5rem 0 0.5rem 0;
}

#navbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0.3rem 1rem 0.3rem;
    max-width: 30rem;
    margin: auto;
}

.navbarTab {
    flex-grow: 1;
    text-align: center;
    padding: 1rem 0 1rem 0;
    user-select: none;
}

.currNavbarTab {
    border-bottom: 5px solid var(--color-accent-900);
    border-radius: 4px;
}

/* theme switch */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch > input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider {
    background-color: var(--color-accent-900);
}

input:focus + .slider {
    box-shadow: 0 0 1px var(--color-accent-900);
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>