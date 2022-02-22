<template>
    <div id="content">
        <div id="search">
            <input id="searchInput" v-model="stopCode" placeholder="Enter a stop id..." autocomplete="off">
            <button id="searchButton" @click="renderData" type="button"><img alt="search-icon" style="width: 1.6rem; height: 1.6rem" src="../assets/images/search.svg"></button>
        </div>
        <div id="stopHeader">
            <b id="stopName">{{ stopName }}</b>
            <img alt="addStopToFavsIcon" v-if="!stopIsFav && stopIsFav !== null" @click="addStopToFavs()" class="icon" src="../assets/images/empty_heart.svg">
            <img alt="removeStopFromFavsIcon" v-if="stopIsFav && stopIsFav !== null" @click="removeStopFromFavs()" class="icon" src="../assets/images/filled_heart.svg">
        </div>
        <div id="mainContent">
            <div id="line" v-for="line in lines" :key="line.id">
                <span class="lineName">{{ line['lineName'] }}</span>
                <div id="lineTimes">
                    <div id="firstLineTime" >
                        {{ line['firstLineTime'] }}
                    </div>
                    <div v-for="lineTime in line['lineTimes']" :key="lineTime.id">
                        {{ lineTime }}
                    </div>
                </div>
                <div id="busProperties">
                    <img v-if="line['hasAc'] === true" class="icon" src="../assets/images/air_conditioner.svg" alt="air-conditioner">
                    <div v-else class="icon"></div>
                    <img v-if="line['hasPlatform'] === true" class="icon" src="../assets/images/platform.svg" alt="platform">
                    <div v-else class="icon"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Localbase from "localbase"

export default {
    name: "Stop",
    props: {
        stopCodeFromAnotherComponent: String,
    },
    data() {
        return {
            stopCode: this.stopCodeFromAnotherComponent,
            stopName: null,
            stopIsFav: null,
            lines: [],
            db: new Localbase("db"),
        }
    },
    mounted() {
        // check if another component is trying to load a stop
        if (this.stopCode !== null) {
            this.updateStopIsFav()
            document.getElementById("searchButton").click()
        }
    },
    methods: {
        renderData: function () {
            this.getDataFromAPI().then(data => {
                // clear any rendered lines
                this.lines = []

                // update header
                this.stopName = data["name"]
                this.updateStopIsFav()

                // iterate the data from the API and make a nested array with the names and the times of the lines
                for (let i = 0; i < data["lines"].length; i++) {
                    let lineName = data["lines"][i]["name"]
                    let hasAc = data["lines"][i]["times"][0]["hasAc"]
                    let hasPlatform = data["lines"][i]["times"][0]["hasPlatform"]
                    let lineTimes = []

                    // limit the lines' times to 5 (so they render properly on the screen)
                    if (data["lines"][i]["times"].length > 5) {
                        for (let j = 0; j < 5; j++) {
                            lineTimes[j] = data["lines"][i]["times"][j]["time"]
                        }
                    } else {
                        for (let j = 0; j < data["lines"][i]["times"].length; j++) {
                            lineTimes[j] = data["lines"][i]["times"][j]["time"]
                        }
                    }

                    // get the first line time
                    let firstLineTime = lineTimes.shift()

                    // append current line to the "lines" array
                    this.lines[i] = {
                        "lineName": lineName,
                        "firstLineTime": firstLineTime,
                        "lineTimes": lineTimes,
                        "hasAc": hasAc,
                        "hasPlatform": hasPlatform,
                    }
                }
            })
        },
        getDataFromAPI: function () {
            const url = "http://localhost:8080/api/v3/stops/" + this.stopCode;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }
            return fetch(url, {headers}).then(response => response.json())
        },
        addStopToFavs: function () {
            this.db.collection("FavouriteStops").add({
                code: String(this.stopCode),
                name: this.stopName,
            }).then(() => this.updateStopIsFav())
        },
        removeStopFromFavs: function () {
            this.db.collection("FavouriteStops").doc({
                code: String(this.stopCode)
            }).delete().then(() => this.updateStopIsFav())
        },
        updateStopIsFav: function () {
            // updates this.stopIsFav which shows if the currently loaded stop
            // is a favourite one or not
            this.db.collection("FavouriteStops").get().then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]["code"] === String(this.stopCode)) {
                        this.stopIsFav = true
                        return
                    }
                }
                this.stopIsFav = false
            })
        },
    },
}
</script>

<style scoped>
@import "../assets/colors.css";

#content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#search {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20rem;
    height: 3rem;
    border-radius: 0.3rem;
}

#search button {
    height: 3rem;
    width: 5rem;
    padding: 0.5rem;
    margin: 0;
    border: 1px solid #d3d3d3;
    border-radius: 25px;
    background: var(--color-accent-900);
}

#search input {
    height: 40px;
    width: 12rem;
    text-align: center;
    font-size: 20px;
    border: 0;
    border-bottom: 2px solid black;
    padding: 0;
    margin: 0 1rem 0 0;
    background: 0;
}

#search input:focus {
    outline: none;
}

#stopHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 1rem;
    height: 3rem;
    margin: 0.6rem 0 0.6rem 0;
}

#stopName {
    font-size: 20px;
    text-align: center;
}

.icon {
    width: 1.8rem;
    height: 1.8rem;
    padding-bottom: 0.3rem;
}

#mainContent {
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
}

#line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 97vw;
    max-width: 25rem;
    height: 5rem;
    background: var(--color-neutral-200);
}

.lineName {
    text-align: center;
    width: 9rem;
    font-size: 30px;
    font-weight: bold;
}

#firstLineTime {
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
}

#lineTimes {
    display: flex;
    column-gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}

#busProperties {
    display: flex;
    align-items: center;
    column-gap: 0.4rem;
    margin: 1rem;
}
</style>