<template>
    <div id="mainContent">
        <p id="noStopsPlaceholder" v-if="stops.length === 0">You don't have any favourite stops :(</p>
        <div class="stop" v-for="stop in stops" :key="stop.id">
            <div class="stopData" @click="$emit('load-stop', stop['code'])">
                <span class="stopCode">
                     {{ stop["code"] }}
                </span>
                <span class="stopName">
                    {{ stop["name"] }}
                </span>
            </div>
            <img alt="removeFromFavsIcon" @click="removeStop(stop['code'])" class="icon" src="../assets/images/remove.svg">
        </div>
    </div>
</template>

<script>
// an IndexedDB library
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
                this.stops = data
            })
        },
        getStopsFromDB: function () {
            return this.db.collection("FavouriteStops").get()
        },
        removeStop: function (stopCode) {
            this.db.collection("FavouriteStops").doc({code: stopCode}).delete().then(() => this.renderStops())
        }
    }
}
</script>

<style scoped>
@import "../assets/colors.css";

#mainContent {
    display: flex;
    flex-direction: column;
}

.stop {
    display: flex;
    align-items: center;
    max-width: 35rem;
    margin: auto;
    background: var(--color-neutral-200);
}

.stopData {
    display: flex;
    align-items: center;
    height: 3rem;
    width: 97vw;
}

.stopName {
    font-size: 18px;
    text-align: center;
    margin: auto;
    max-width: 14rem;
}

.stopCode {
    text-align: center;
    width: 3rem;
    margin: 0 0 0 0.5rem;
    color: #d2d2d2;
    background: var(--color-accent-600)
}

.icon {
    width: 1.6rem;
    height: 1.6rem;
    padding: 0 0.5rem 0 0.5rem;
}

#noStopsPlaceholder {
    text-align: center;
    font-size: 30px;
}
</style>