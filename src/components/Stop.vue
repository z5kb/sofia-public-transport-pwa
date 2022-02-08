<template>
    <div id="stopArea">
        <div id="search">
            <input v-model="stopCode">
            <button id="searchButton" @click="renderData" type="button">Search</button>
        </div>
        <div id="stopHeader">
            <a>{{ stopName }}</a>
            <img alt="addStopToFavsIcon" v-if="!stopIsFav && stopIsFav !== null" @click="addStopToFavs()" class="icon" src="../assets/navigation-bar/favourite-heart@48x48.svg">
            <img alt="removeStopFromFavsIcon" v-if="stopIsFav && stopIsFav !== null" @click="removeStopFromFavs()" class="icon" src="../assets/navigation-bar/alerts@48x48.svg">
        </div>
        <div id="stopMainContent">
            <div id="line" v-for="line in lines" :key="line.id">
                <p>{{ line[0] }}</p>
                <div id="lineTimes">
                    <div v-for="lineTime in line[1]" :key="lineTime.id">
                        {{ lineTime }}
                    </div>
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
            this.getDataFromAPI(this.stopCode).then(response => response.json().then(data => {
                // clear any rendered lines
                this.lines = []

                // update header
                this.stopName = data["name"]
                this.updateStopIsFav()

                // iterate the data from the API and make a nested array with the names and the times of the lines
                for (let i = 0; i < data["lines"].length; i++) {
                    let lineName = data["lines"][i]["name"]
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

                    // add spaces so the names are aligned properly on the html page
                    if (lineName.length === 1) {
                        lineName = "  " + lineName
                    } else if (lineName.length === 2) {
                        lineName = " " + lineName
                    }

                    // append current line to the "lines" array
                    this.lines[i] = [lineName, lineTimes]
                }
            }));
        },
        getDataFromAPI: function () {
            const url = "http://localhost:8080/api/v3/stops/" + this.stopCode;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }

            return fetch(url, {headers})
                .then(response => response)
                .then(data => data);
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
#stopArea {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#search {
    display: flex;
    align-items: center;
}

#search button {
    width: 4rem;
    height: 1.3rem;
}

#stopHeader {
    display: flex;
    font-size: 20px;
    align-items: center;
    justify-content: center;
}

.icon {
    width: 1rem;
    height: 1rem;
    padding: 1rem;
}

#stopMainContent {
    display: flex;
    flex-direction: column;
}

#line {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    width: 97vw;
    background: grey
}

#line p {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 1rem 1rem 1rem
}

#lineTimes {
    display: flex;
    column-gap: 1rem;
}
</style>