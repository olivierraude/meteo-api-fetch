const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

/* const main = async (withIP = true) => { */
const main = async (withIP = true) => {

    let city;
    if (withIP) {
        // On récupère l'ip : https://api.ipify.org?format=json
            const ip = await fetch('https://api.ipify.org?format=json')
            .then(result => result.json())
            .then(json => json.ip);
         // On récupère la ville grâce à l'ip : http://freegeoip.net/json/adresseIP   
            city = await fetch(`http://api.ipstack.com/${ip}?access_key=1ce967b65af84cb889b9d8b0515aa2b1`)
            .then(result => result.json())
            .then(json => json.city.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    } else {
        city = document.querySelector('#city').textContent;
    }
// On récupère la météo grâce à la ville : http://freegeoip.net/json/adresseIP
    const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a28db2454a4c2c1d1b53fd342abf8f91&lang=fr&units=metric`)
        .then(result => result.json())
        .then(json => json);
// On affiche les infos météo
    displayWeather(meteo);

}

const displayWeather = (data) => {
    
    const city = data.name;
    const temperature = data.main.temp;
    const weather = data.weather[0].description;
    const icon = data.weather[0].icon;
    const conditions = data.weather[0].main;
    console.log(weather);
    console.log(conditions);
    
    document.querySelector('#city').textContent = city;
    document.querySelector('#temperature').textContent = Math.round(temperature);
    document.querySelector('#description').textContent = capitalize(weather);
    document.querySelector('img').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#city');

ville.addEventListener('click', () => {
    ville.contentEditable = true;
});

ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
});
main();