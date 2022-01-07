<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script lang="ts">
export default {
    name: "HelloWorld",
    props: {
        msg: {
            type: String,
            required: true,
        },
    },
};

render_data();

function render_data() {
    get_data_from_api()
        .then(response => response.json().then(data => console.log(data)));
}

function get_data_from_api() {
    const url = "http://localhost:8080/v3/stops/487";
    const headers = {
        "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
        "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
    };

    return fetch(url, {headers})
        .then(response => response)
        .then(data => data);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
