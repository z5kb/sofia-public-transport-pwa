<template>
    <p>something</p>
</template>

<script>

render_data(1);

function render_data(number) {
    if(number === 1) {
        get_data_from_api_NOT_WORKING().then(result =>
            console.log(result)
        )
    } else if(number === 0) {
        get_data_from_api_WORKING().then(result =>
            console.log(result)
        )
    } else {
        third_try().then(result =>
            console.log(result)
        )
    }
}

function get_data_from_api_NOT_WORKING() {
    const url = "http://localhost/v3/stops/487";
    // const url = "http://localhost:8080/v3/stops/487";
    // const url = "https://api.sofiatransport.com/v3/stops/487"
    const headers = {
        "x-api-key": "fudeqogehuxazisaqubojawerulaciquxofilibupetirimu",
        "x-user-id": "0c8ceb98-aea8-4f47-8fb1-cc5c63abf379",
        // "Access-Control-Allow-Origin": "http://localhost:8080",
        // "mode": "no-cors",
        // "Content-Type": "application/json"
    };

    return fetch(url, {headers})
        .then(response => response)
        .then(data => console.log(data))
}

function get_data_from_api_WORKING() {
    const url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR";
    return fetch(url)
        .then(response => response.json())
        .then(data => data)
}

function third_try() {
    const headers = {
        "authorization": "Bearer BQD1dHLEm4EfIYuL5jbO4Jk-NA4eZFLJfKdoS97dC5J2umKEJXGBK3Z1XQEpSSJA_vWSD13TDm_ur1n66QI"
    }

    const url = "https://api.spotify.com/v1/search?type=album%2Cartist%2Cplaylist%2Ctrack%2Cshow_audio%2Cepisode_audio&q=touchthislight&decorate_restrictions=false&best_match=true&include_external=audio&limit=10&market=US"
    return fetch(url, {headers})
        .then(response => response.json())
        .then(data => data)
        .catch(e => console.log(e))
}
</script>

<style scoped>
</style>