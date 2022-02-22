<template>
    <div id="mainContent">
        <div id="header">
            <select class="select" @change="loadType($event)">
                <option selected disabled hidden value="">Изберете тип</option>
                <option value="1">Автобуси</option>
                <option value="2">Тролеи</option>
                <option value="0">Трамваи</option>
            </select>
            <span class="disabledSelectParent">
                <select id="linesSelect" class="select disabledSelect" @change="loadLine()">
                    <option selected disabled hidden>--------------</option>
                    <option v-for="line in lines" :key="line.id" value="placeholder">{{ line[0] }}</option>
                </select>
            </span>
        </div>
        <div id="line">
            <div class="route" v-if="firstRouteIsActive">
                <div class="routeTitlesDiv" @click="toggleStopsVisibility('firstRouteStops')" v-bind:style="firstRouteTitleStyle">
                    <span class="routeTitle">ОТ {{ firstRouteFirstTitle }}</span>
                    <span class="routeTitle">ДО {{ firstRouteSecondTitle }}</span>
                </div>
                <div id="firstRouteStops">
                    <div class="stop" v-for="[code, name] in firstRouteStops" :key="[code.id, name.id]" @click="$emit('load-stop', String(code[1]))">
                        <span class="stopName">
                            {{ name[1] }}
                        </span>
                        <span class="stopCode">
                             {{ code[1] }}
                         </span>
                    </div>
                </div>
            </div>
            <div class="route" v-if="secondRouteIsActive">
                <div class="routeTitlesDiv" @click="toggleStopsVisibility('secondRouteStops')" v-bind:style="secondRouteTitleStyle">
                    <span class="routeTitle">ОТ {{ secondRouteFirstTitle }}</span>
                    <span class="routeTitle">ДО {{ secondRouteSecondTitle }}</span>
                </div>
                <div id="secondRouteStops">
                    <div class="stop" v-for="[code, name] in secondRouteStops" @click="$emit('load-stop', String(code[1]))" :key="[code.id, name.id]">
                        <span class="stopName">
                            {{ name[1] }}
                        </span>
                        <span class="stopCode">
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
            firstRouteTitleStyle: "border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;",
            secondRouteTitleStyle: "border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;",
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
        loadType: function (event) {
            // set the current lines' type
            this.currentTypeId = event.target.value

            // start rendering the data on the page
            this.getLinesFromApi().then(response => response.json()).then(data => {
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

                // change CSS so the "Select a line" <select> appears enabled
                document.getElementById("linesSelect").classList.remove("disabledSelect")
                document.getElementById("linesSelect").parentElement.classList.remove("disabledSelectParent")
                document.getElementById("linesSelect").children[0].innerHTML = "Изберете линия"
            })
        },
        loadLine: function () {
            // remove any previously rendered stops
            this.firstRouteStops = []
            this.secondRouteStops = []

            // start rendering the data on the page
            let lineId = document.getElementById("linesSelect").value
            this.getLineFromApi(lineId).then(response => response.json()).then(data => {
                // render first route
                this.firstRouteFirstTitle = data["routes"][0]["stops"][0]["name"]
                this.firstRouteSecondTitle = data["routes"][0]["stops"][data["routes"][0]["stops"].length - 1]["name"]
                for (let i = 0; i < data["routes"][0]["stops"].length; i++) {
                    let currStop = new Map()
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
                    currStop.set("code", data["routes"][1]["stops"][i]["code"])
                    currStop.set("name", data["routes"][1]["stops"][i]["name"])
                    this.secondRouteStops[i] = currStop
                }
                this.secondRouteIsActive= true
            })
        },
        getLinesFromApi: function () {
            const url = "http://localhost:8080/api/v3/lines/" + this.currentTypeId;
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
        toggleStopsVisibility: function (stopsDivId) {
            let el = document.getElementById(stopsDivId)
            if (el.style.display === "flex") {
                if (stopsDivId === "firstRouteStops") {
                    this.firstRouteTitleStyle = "border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;"
                    el.style.display = "none"
                } else if (stopsDivId === "secondRouteStops") {
                    this.secondRouteTitleStyle = "border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;"
                    el.style.display = "none"
                }
            } else {
                if (stopsDivId === "firstRouteStops") {
                    this.firstRouteTitleStyle = "border-radius: 0.5rem 0.5rem 0 0;"
                    el.style.display = "flex"
                } else if (stopsDivId === "secondRouteStops") {
                    this.secondRouteTitleStyle = "border-radius: 0.5rem 0.5rem 0 0;"
                    el.style.display = "flex"
                }
            }
        }
    }
}
</script>

<style scoped>
#mainContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 2rem;
    max-width: 35rem;
    margin: auto;
}

#header {
    display: flex;
    justify-content: center;
}

.select {
    text-align: center;
    height: 3rem;
    width: 10rem;
    user-select: none;
    border: none;
    background: var(--color-neutral-200);
}

.select:after {
    content: "hi";
}

.select:focus {
    outline: none;
}

.disabledSelectParent {
    cursor: not-allowed;
}

.disabledSelect {
    pointer-events: none;
}

.route {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 35rem;
}

.routeTitlesDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 5rem;
    width: 100%;
    background: var(--color-accent-300);
    user-select: none;
}

.routeTitle {
    font-size: 18px;
}

#line {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
}

#firstRouteStops, #secondRouteStops {
    display: none;
    flex-direction: column;
    width: 100%;
}

.stop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    background: var(--color-neutral-200);
    user-select: none;
}

.stopName {
    font-size: 16px;
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
</style>