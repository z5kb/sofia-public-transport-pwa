<template>
    <div id="content">
        <div id="search">
            <input v-model="stopCode" placeholder="Въведете номер на спирка..." autocomplete="off">
            <button id="searchButton" @click="renderData()" type="button">
                <div>
                    <span id="searchIcon"></span>
                    <a>ТЪРСЕНЕ</a>
                </div>
            </button>
        </div>
        <div id="stopHeader">
            <b id="stopName">{{ stopName }}</b>
            <span id="favouriteUnfilledIcon" v-if="!stopIsFav && stopIsFav !== null" @click="addStopToFavs()"></span>
            <span id="favouriteFilledIcon" v-if="stopIsFav && stopIsFav !== null" @click="removeStopFromFavs()"></span>
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
                    <span id="airConditionerIcon" v-if="line['hasAc'] === true"></span>
                    <div v-else class="icon"></div>
                    <span id="accessibleIcon" v-if="line['hasPlatform'] === true"></span>
                    <div v-else class="icon"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// an IndexedDB library
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
                if (this.stopIsFav === null && this.stopCode === null) {
                    return
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 0.8rem;
    width: 80%;
    max-width: 25rem;
    border-radius: 0.3rem;
}

#searchButton {
    height: 36px;
    width: 100%;
    max-width: 30rem;
    padding: 0 16px 0 12px;
    margin: 0;
    border: 0;
    border-radius: 5px;
    background: var(--color-accent-900);

    box-shadow: 0 3px 5px rgb(11, 25, 47, 0.2);
}

#searchButton > div {
    min-width: 0;
    min-height: 0;
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
}

#searchButton > div > a {
    color: var(--color-search-button);
    font-size: 15px;
    letter-spacing: 1px;
    transition: 0.5s;
}

#searchIcon {
    mask: url("../assets/images/search_black_18px.svg");
    background: var(--color-search-button);
    width: 18px;
    height: 18px;
    transition: 0.5s;
}

#search > input {
    color: var(--color-main-text);
    height: 40px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    border: 0;
    border-bottom: 2px solid var(--color-main-text);
    padding: 0;
    margin: 0;
    background: 0;
    transition: 0.5s;
}

::placeholder {
    color: var(--color-placeholder);
}

#search > input:focus {
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
}

#favouriteUnfilledIcon {
    mask: url("../assets/images/favorite_border_black_18px.svg");
    background: var(--color-main-text);
    width: 18px;
    height: 18px;
    transition: 0.5s;
}

#favouriteFilledIcon {
    mask: url("../assets/images/favorite_black_18px.svg");
    background: var(--color-main-text);
    width: 18px;
    height: 18px;
    transition: 0.5s;
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

#airConditionerIcon {
    mask: url("../assets/images/ac_unit_black_24px.svg");
    background: var(--color-main-text);
    width: 24px;
    height: 24px;
    transition: 0.5s;
}

#accessibleIcon {
    mask: url("../assets/images/accessible_black_24px.svg");
    background: var(--color-main-text);
    width: 24px;
    height: 24px;
    transition: 0.5s;
}
</style>