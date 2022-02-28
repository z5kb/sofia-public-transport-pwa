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
            <span class="removeIcon" @click="removeStop(stop['code'])"></span>
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
    align-items: center;
}

.stop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.5rem;
    width: 100%;
    max-width: 35rem;
    padding: 0.3rem 0 0.3rem 0;
    background: var(--color-neutral-200);

    /* set borders & overlap them */
    border: 1px solid var(--color-borders);
    margin-top: -1px;
}

.stopData {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
    width: 18rem;
    flex-grow: 2;
}

.stopName {
    font-size: 18px;
    text-align: center;
    max-width: 14rem;
    margin: auto;
}

.stopCode {
    text-align: center;
    width: 3rem;
    margin: 1rem;
    padding: 0.15rem;
    border-radius: 3px;
    color: var(--color-neutral-200);
    background: var(--color-neutral-500);
    transition: 0.5s;
}

.removeIcon {
    mask: url("../assets/images/remove_circle_outline_black_18px.svg");
    background: var(--color-main-text);
    width: 32px;
    height: 32px;
    margin: 1rem;
    transition: 0.5s;
}

#noStopsPlaceholder {
    text-align: center;
    font-size: 30px;
}
</style>