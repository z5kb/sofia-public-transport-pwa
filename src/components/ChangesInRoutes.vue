<template>
    <div id="mainContent">
        <div id="test"></div>
        <div class="change" v-for="change in changes" :key="change.id">
            <div class="changeTitle" @click="renderContent(change.id)">
                <span>
                {{ change.title }}
                </span>
            </div>
            <div class="changeContent" v-bind:id="change.id">
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
            changes: [],
            content: null,
        }
    },
    mounted() {
        this.renderTitles()
    },
    methods: {
        renderTitles: function () {
            this.fetchTitles().then(response => response.json()).then(data => {
                // clear previous changes
                this.changes = {}

                // extract the needed data from the data the API returned
                for (let i = 0; i < data["results"].length; i++) {
                    let id = data["results"][i]["id"]
                    let title = data["results"][i]["title"]
                    this.changes[i] = {"id": id, "title": title}
                }
            })
        },
        fetchTitles: function () {
            return fetch("http://localhost:8080/changes-in-routes-api/")
        },
        renderContent: function (changeId) {
            if (document.getElementById(changeId).innerHTML === "") {
                // data has not been fetched yet
                this.fetchContent(changeId).then(response => response.json()).then(data => {
                    document.getElementById(changeId).innerHTML = "<span>" + this.scrapeContent(data["content"]) + "</span>"
                    this.toggleContentVisibility(changeId)
                })
            } else {
                // data has already been fetched
                this.toggleContentVisibility(changeId)
            }
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
                    // check if there is an image in the <strong> tag
                    if(href[0].children[0].children[0].name === "img") {
                        href.remove()
                    } else {
                        // regular scenario
                        let data = href[0].children[0].children[0].data
                        href.parent().prepend("<strong>" + data + "</strong>")
                        href.remove()
                    }
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

            // return the scraped content
            return $.html()
        },
        toggleContentVisibility: function (id) {
            let el = document.getElementById(String(id))
            if (el.style.display === "block") {
                el.style.display = "none"
            } else {
                el.style.display = "block"
            }
        },
    }
}
</script>

<style scoped>
@import "../assets/colors.css";

#mainContent {
    display: flex;
    flex-direction: column;
    max-width: 50rem;
    margin: auto;
}

.change {
    display: flex;
    flex-direction: column;
}

.changeTitle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    background: var(--color-neutral-200);
    user-select: none;
}

.changeTitle span {
    text-align: center;
}

.changeContent {
    padding: 0 1rem 0 1rem;
    line-height: 1.5;
    background: var(--color-neutral-100);
}
</style>