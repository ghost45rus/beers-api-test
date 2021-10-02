let url = new URL("https://api.punkapi.com/v2/beers?");
let params = {page: 1, limit: 25}

console.log("Запустили скрипт api")


async function getBear(url, params){
    const response = await fetch(url + new  URLSearchParams(params));
    return await response.json();
}




