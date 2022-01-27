<template>
    <div id="linesComponentArea">
        <div id="selectTypeDiv">
            <button id="typesButton" v-on:click="toggleSelectionDropdown('typesList')">Select a type</button>
            <ul id="typesList" style="display: none">
                <li v-on:click="loadType(1, 'Buses')">Buses</li>
                <li v-on:click="loadType(2, 'Trolleys')">Trolleys</li>
                <li v-on:click="loadType(0, 'Trams')">Trams</li>
            </ul>
        </div>
        <select id="linesSelect" v-on:change="loadLine()">
            <option selected disabled hidden>Select a line</option>
            <option v-for="line in lines" :key="line.id" value="placeholder">{{ line[0] }}</option>
        </select>
        <div id="lineArea">

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
                // TODO render data on the page
            })
        },
        getLinesFromApi: function (typeId) {
            const url = "http://localhost:8080/v3/lines/" + typeId;
            const headers = {
                "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
                "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
            }

            return fetch(url, {headers})
                .then(response => response)
                .then(data => data);
        },
        getLineFromApi: function (lineId) {
            const url = "http://localhost:8080/v3/lines/" + this.currentTypeId + "/" + lineId;
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
#linesComponentArea {
    display: flex;
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
    list-style: none;
    text-align: left;
    background: grey;
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
</style>