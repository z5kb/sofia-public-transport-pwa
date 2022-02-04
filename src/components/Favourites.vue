<template>
</template>

<script>
import Localbase from "localbase"

export default {
    name: "Favourites",
    data() {
        return {
            db: new Localbase("db"),
        }
    },
}
</script>

<style scoped>

</style>