<template>
    <div id="mainContent">
        <div id="test"></div>
        <div class="change" v-for="[changeId, changeTitle] in titles" :key="[changeId.id, changeTitle.id]">
            <div class="changeTitle" @click="renderContent(changeId)">
                {{ changeTitle}}
            </div>
            <div class="changeContent" v-bind:id="changeId">
            </div>
        </div>
    </div>
</template>

<script>
import cheerio from "cheerio"

export default {
    name: "ChangesInRoutes",
    data() {
        return {
            titles: [],
            content: null,
        }
    },
    mounted() {
        this.renderTitles()
    },
    methods: {
        renderTitles: function () {
            this.fetchTitles().then(response => response.json()).then(data => {
                // extract the needed data from the data the API returned
                for (let i = 0; i < data["results"].length; i++) {
                    let changeId = data["results"][i]["id"]
                    let changeTitle = data["results"][i]["title"]
                    this.titles[i] = [changeId, changeTitle]
                }
            })
        },
        fetchTitles: function () {
            return fetch("http://localhost:8080/changes-in-routes-api/")
        },
        renderContent: function (changeId) {
            this.fetchContent(changeId).then(response => response.json()).then(data => {
                document.getElementById(changeId).innerHTML = this.scrapeContent(data["content"])
            })
        },
        fetchContent: function (changeId) {
            return fetch("http://localhost:8080/changes-in-routes-api/" + changeId + "/")
        },
        scrapeContent: function (content) {
            // load the content in a Cheerio object in order to manipulate it with the library
            let $ = cheerio.load(content)

            // select all hrefs and iterate them
            let hrefs = $("a")
            hrefs.each(function () {
                // the current href (from type LoadedCheerio in order to have a .remove() method)
                let href = $(this)

                // check if the element inside the href is data we need or <img>
                if (href[0].children[0].name === "strong") {
                    let data = href[0].children[0].children[0].data
                    href.parent().prepend("<strong>" + data + "</strong>")
                    href.remove()
                } else if (href[0].children[0].name === "img") {
                    // delete the parent of the <img> and everything inside it
                    href.parent().remove()
                } else {
                    // the href contained something else than <strong> or <img>
                    // (probably a mistake in the data we get from the API)
                    href.prev().after(" " + href[0].children[0].data)
                    href.remove()
                }
            })

            return $.html()
        },
    }
}
</script>

<style scoped>
#mainContent {
    display: flex;
    flex-direction: column;
}

.change {
    display: flex;
    flex-direction: column;
}

.changeTitle {
    background: gray;
}

.changeContent {
    background: lightgray;
}
</style>