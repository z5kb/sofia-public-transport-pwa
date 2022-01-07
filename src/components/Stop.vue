<template>
    <div id="stopArea">
        <div id="searchArea">
            <input v-model="stopId">
            <button v-on:click="render_data(stopId)" type="button">Search</button>
        </div>
        <p id="stopName"></p>
        <div id="linesArea">
            <div id="lineArea" v-for="line in lines" :key="line.id">
                <p>{{ line[0] }}</p>
                <div id="lineTimes">
                    <div v-for="lineTime in line[1]">
                        {{ lineTime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Stop",
    data() {
        return {
            stopId: null,
            lines: [],
        }
    },
    methods: {
        render_data: function (stopId) {

            this.get_data_from_api(stopId)
                .then(response => response.json().then(data => {
                    // clear rendered components (if any)
                    this.lines = []

                    // change stop name
                    document.getElementById("stopName").innerHTML = data["name"]

                    // iterate the data from the API and make a nested array with the names and the times of the lines
                    for (let i = 0; i < data["lines"].length; i++) {
                        let lineName = data["lines"][i]["name"]
                        let lineTimes = []
                        for (let j = 0; j < data["lines"][i]["times"].length; j++) {
                            lineTimes[j] = data["lines"][i]["times"][j]["time"]
                        }

                        if (lineName.length === 1) {
                            lineName = "  " + lineName
                        } else if (lineName.length === 2) {
                            lineName = " " + lineName
                        }
                        this.lines[i] = [lineName, lineTimes]
                    }
                }));
        },
        get_data_from_api: function (stopId) {
            const url = "http://localhost:8080/v3/stops/" + stopId;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }

            return fetch(url, {headers})
                .then(response => response)
                .then(data => data);
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

#searchArea {
    display: flex;
    align-items: center;
}

#searchArea button {
    width: 4rem;
    height: 1.3rem;
}

#linesArea {
    display: flex;
    flex-direction: column;
}

#lineArea {
    display: flex;
    align-items: center;
    column-gap: 1rem;

    width: 97vw;
    background: grey
}

#lineArea p {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 1rem 1rem 1rem
}

#lineTimes {
    display: flex;
    column-gap: 1rem;
}
</style>