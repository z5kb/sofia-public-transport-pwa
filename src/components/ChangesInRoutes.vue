<template>
    <button @click="func()">Click Me</button>
</template>

<script>
export default {
    name: "ChangesInRoutes",
    methods: {
        func: function () {
            this.getData().then(response => response.text).then(data => console.log(data))

            // var parser = new DOMParser();
            // var htmlDoc = parser.parseFromString(txt, 'text/html');
            // do whatever you want with htmlDoc.getElementsByTagName('a');
        },
        // TODO try to find a workaround for this
        // getData: function () {
        //     return fetch("http://localhost:8080/route-changes/bg/api/v1/cms/route-changes/?page=1")
        // }
    }
}
</script>

<style scoped>

</style>