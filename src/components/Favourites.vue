<template>
    <div id="mainContent">
        <p id="noStopsPlaceholder" v-if="stops.length === 0">You don't have any favourite stops :(</p>
        <div class="stop" v-for="stop in stops">
            <div class="stopData" @click="$emit('load-stop', stop['code'])">
                <span class="stopName">
                    {{ stop["name"] }}
                </span>
                <span class="stopCode">
                     {{ stop["code"] }}
                </span>
            </div>
            <img alt="removeFromFavsIcon" @click="removeStop(stop['code'])" class="icon" src="../assets/navigation-bar/alerts@48x48.svg">
        </div>
    </div>
</template>

<script>
import Localbase from "localbase"

export default {
    name: "Favourites",
    data() {
        return {
            stops: [],
            db: new Localbase("db"),
        }
    },
    created() {
        this.renderStops()
    },
    methods: {
        renderStops: function () {
            this.getStopsFromDB().then(data => {
                console.log("data", data)
                this.stops = data
            })
        },
        getStopsFromDB: function () {
            return this.db.collection("FavouriteStops").get()
        },
        removeStop: function (stopCode) {
            console.log(stopCode)
            this.db.collection("FavouriteStops").doc({code: stopCode}).delete().then(response => this.renderStops())
        }
    }
}
</script>

<style scoped>
#mainContent {
    display: flex;
    flex-direction: column;
}

.stop {
    display: flex;
    align-items: center;
    background: lightgray;
}

.stopData {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    height: 3rem;
    width: 97vw;
    background: lightgray;
}

.stopName {
    font-size: 18px;
    text-align: center;
    margin: auto;
    max-width: 16rem;
}

.stopCode {
    text-align: center;
    width: 3rem;
    margin-right: 0.5rem;
    color: #d2d2d2;
    background: #414141;
}

.icon {
    width: 1rem;
    height: 1rem;
    padding: 1rem;
}

#noStopsPlaceholder {
    text-align: center;
    font-size: 30px;
}
</style>