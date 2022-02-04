<template>
    <div id="stopMainContent">
        <div id="selectTypeDiv">
            <button id="typesButton" @click="toggleSelectionDropdown('typesList')">Select a type</button>
            <ul id="typesList" style="display: none">
                <li @click="loadType(1, 'Buses')">Buses</li>
                <li @click="loadType(2, 'Trolleys')">Trolleys</li>
                <li @click="loadType(0, 'Trams')">Trams</li>
            </ul>
        </div>
        <select id="linesSelect" @change="loadLine()">
            <option selected disabled hidden>Select a line</option>
            <option v-for="line in lines" :key="line.id" value="placeholder">{{ line[0] }}</option>
        </select>
        <div id="line">
            <div class="route" v-if="firstRouteIsActive">
                <div class="routeTitles">
                    <span>{{ firstRouteFirstTitle }}</span>
                    <span>{{ firstRouteSecondTitle }}</span>
                </div>
                <div>
                    <div class="routeStop" v-for="[id, code, name] in firstRouteStops" @click="$emit('load-stop', code)">
                        <span class="routeStopName">
                            {{ name[1] }}
                        </span>
                        <span class="routeStopCode">
                             {{ code[1] }}
                         </span>
                    </div>
                </div>
            </div>
            <div class="route" v-if="secondRouteIsActive">
                <div class="routeTitles">
                    <span>{{ secondRouteFirstTitle }}</span>
                    <span>{{ secondRouteSecondTitle }}</span>
                </div>
                <div>
                    <div class="routeStop" v-for="[id, code, name] in secondRouteStops" @click="$emit('load-stop', code)">
                        <span class="routeStopName">
                            {{ name[1] }}
                        </span>
                        <span class="routeStopCode">
                             {{ code[1] }}
                         </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Lines",
    data() {
        return {
            currentTypeId: null,
            lines: [],
            firstRouteIsActive: false,
            firstRouteFirstTitle: null,
            firstRouteSecondTitle: null,
            firstRouteStops: [],
            secondRouteIsActive: false,
            secondRouteFirstTitle: null,
            secondRouteSecondTitle: null,
            secondRouteStops: [],
        }
    },
    methods: {
        toggleSelectionDropdown: function (dropdownId) {
            let el = document.getElementById(dropdownId)
            if (el.style.display === "none") {
                el.style.display = "block"
            } else {
                el.style.display = "none"
            }
        },
        loadType: function (typeId, typeName) {
            // save the chosen type
            this.currentTypeId = typeId

            // update the text of the button
            document.getElementById("typesButton").innerText = typeName

            // close dropdown
            this.toggleSelectionDropdown("typesList")

            // start rendering the data on the page
            this.getLinesFromApi(typeId).then(response => response.json()).then(data => {
                // clear rendered lines (if any)
                this.lines = []

                // extract the needed information from the data returned from the api
                for (let i = 0; i < data.length; i++) {
                    this.lines[i] = [data[i]["name"], data[i]["id"]]
                }

                return this.lines
            }).then(lines => {
                // set each lineId as the value of each <option>
                let renderedLines = document.getElementById("linesSelect").children
                for (let i = 0; i < renderedLines.length - 1; i++) {
                    renderedLines[i + 1].setAttribute("value", lines[i][1])
                }
            })
        },
        loadLine: function () {
            // start rendering the data on the page
            let lineId = document.getElementById("linesSelect").value
            this.getLineFromApi(lineId).then(response => response.json()).then(data => {
                // render first route
                this.firstRouteFirstTitle = data["routes"][0]["stops"][0]["name"]
                this.firstRouteSecondTitle = data["routes"][0]["stops"][data["routes"][0]["stops"].length - 1]["name"]
                for (let i = 0; i < data["routes"][0]["stops"].length; i++) {
                    let currStop = new Map()
                    currStop.set("id", data["routes"][0]["stops"][i]["id"])
                    currStop.set("code", data["routes"][0]["stops"][i]["code"])
                    currStop.set("name", data["routes"][0]["stops"][i]["name"])
                    this.firstRouteStops[i] = currStop
                }
                this.firstRouteIsActive = true

                // render second route
                this.secondRouteFirstTitle= data["routes"][1]["stops"][0]["name"]
                this.secondRouteSecondTitle= data["routes"][1]["stops"][data["routes"][1]["stops"].length - 1]["name"]
                for (let i = 0; i < data["routes"][1]["stops"].length; i++) {
                    let currStop = new Map()
                    currStop.set("id", data["routes"][1]["stops"][i]["id"])
                    currStop.set("code", data["routes"][1]["stops"][i]["code"])
                    currStop.set("name", data["routes"][1]["stops"][i]["name"])
                    this.secondRouteStops[i] = currStop
                }
                this.secondRouteIsActive= true
            })
        },
        getLinesFromApi: function (typeId) {
            const url = "http://localhost:8080/api/v3/lines/" + typeId;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }

            return fetch(url, {headers})
                .then(response => response)
                .then(data => data);
        },
        getLineFromApi: function (lineId) {
            const url = "http://localhost:8080/api/v3/lines/" + this.currentTypeId + "/" + lineId;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }

            return fetch(url, {headers})
                .then(response => response)
                .then(data => data);
        },
    }
}
</script>

<style scoped>
#stopMainContent {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 80%;
    margin: auto;
}

#selectTypeDiv {
    width: 8rem;
    max-width: 8rem;
}

#selectTypeDiv button {
    height: 2rem;
    width: 8rem;
}

#typesList {
    display: none;
    position: absolute;
    list-style: none;
    text-align: left;
    background: lightgray;
    margin: 0;
    padding: 0;
}

#typesList li {
    width: 8rem;
}

#linesSelect {
    height: 2rem;
    width: 8rem;
}

.route {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
}

.routeTitles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 5rem;
    width: 97vw;
    background: grey;
}

.routeStop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    width: 97vw;
    background: lightgray;
}

.routeStopName {
    font-size: 18px;
    text-align: center;
    margin: auto;
    max-width: 16rem;
}

.routeStopCode {
    text-align: center;
    width: 3rem;
    margin-right: 0.5rem;
    color: #d2d2d2;
    background: #414141;
}
</style>