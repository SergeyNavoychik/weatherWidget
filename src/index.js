import 'bootstrap'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './style.css'

const APIKEY = "70c5e262894ce9a2644f53bda2d39d24"
const urlRequest = "http://api.openweathermap.org/data/2.5/forecast/daily?"
const weekDays = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
window.onload = () => {
    createHtml()
    getPosition()
        .then( result => {
            return getWeather(result, urlRequest, APIKEY)
        })
        .then( result => {
                            tabToday(result.list[0], result.city)
                            tabTomorrow(result.list[1],result.city)
                            tabFiveDays( result )
                          }
        )
        .catch( error => {
            let output = document.querySelectorAll("#weather .tab-pane")
            output.forEach( item => item.innerHTML = `<p class="_weatherAlert">${error}</p>`)
        })
}
function createHtml() {
    let liArray = [],
        divContentArray = []
    let ul = document.createElement("ul")
    ul.className = "nav nav-tabs"
    ul.setAttribute("role", "tablist")
    for(let i = 0; i < 3; ++i){
        let li = document.createElement("li")
        li.setAttribute("role", "presentation")
        i == 0 ? li.classList.add("active") : null
        let a = document.createElement("a")
        a.setAttribute("role", "tab")
        a.setAttribute("data-toggle", "tab")
        switch (i){
            case 0:
                a.textContent = "Today"
                a.setAttribute("href", "#today")
                a.setAttribute("aria-controls", "today")
                break
            case 1:
                a.textContent = "Tomorrow"
                a.setAttribute("href", "#tomorrow")
                a.setAttribute("aria-controls", "tomorrow")
                break
            case 2:
                a.textContent = "5 Days"
                a.setAttribute("href", "#allDays")
                a.setAttribute("aria-controls", "allDays")
                break
            default:
                break
        }
        li.appendChild(a)
        liArray.push(li)
    }
    liArray.forEach( li => { ul.appendChild(li) })
    let tabContent = document.createElement("div")
    tabContent.className = "tab-content"
    for(let i = 0; i < 3; ++i){
        let div = document.createElement("div")
        div.setAttribute("role", "tabpanel")
        div.className = "tab-pane"
        switch (i){
            case 0:
                div.setAttribute("id", "today")
                div.classList.add("active")
                break
            case 1:
                div.setAttribute("id", "tomorrow")
                break
            case 2:
                div.setAttribute("id", "allDays")
                break
            default:
                break
        }
        divContentArray.push(div)
    }
    divContentArray.forEach( div => { tabContent.appendChild(div) })
    let weather = document.getElementById("weather")
    weather.appendChild(ul)
    weather.appendChild(tabContent)
}
function getPosition() {
    return new Promise( (resolve, rejected) => {
        let output = document.querySelectorAll("#weather .tab-pane")
        if (!navigator.geolocation){
            output.forEach( item => item.innerHTML = `<p>Geolocation is not supported by your browser</p>`)
            return;
        }
        function success(position) {
            let { latitude }  = position.coords
            let { longitude } = position.coords
            resolve({ latitude, longitude })
        }
        function error() {
            rejected("Unable to retrieve your location")
        }
        output.forEach( item => item.innerHTML = `<p class="_weatherAlert">Locating…</p>`)
        navigator.geolocation.getCurrentPosition(success, error)
    })
}
function getWeather( { latitude, longitude }, urlRequest, key ) {
    return new Promise( (resolve, rejected) => {
        let url = urlRequest + `lat=${latitude}&lon=${longitude}&units=metric&cnt=5&APPID=${key}`
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function() {
            if(this.status == 200){
                let result = JSON.parse(xhr.responseText);
                resolve(result);
            }
            else {
                let error = new Error(this.statusText);
                rejected(error);
            }
        };
        xhr.onerror = function() {
            rejected(new Error("Error!!!"))
        };
        xhr.send();
    } )
}
function setDate() {
    let days = []
    let today = new Date().getTime();
    for( let i = 0; i < 5; ++i ){
        let newDay = new Date(today)
        days.push(newDay)
        today += 86400000
    }
    return days
}
function tabToday(data, city) {
    let day = new Date
    let imgUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
    let tab = document.querySelector("#weather #today")
    tab.innerHTML = `<div class="row">
                        <img src=${imgUrl} class="_weatherImg col-xs-3" alt="">
                        <div class="col-xs-5">
                            <p class="_weatherTemperature">${Math.round(data.temp.eve)}&#8451;                       
                                <span>Max: ${Math.round(data.temp.max)}&#8451</span>
                                <span>Min: ${Math.round(data.temp.min)}&#8451</span>    
                            </p>   
                            <p class="_weatherDesc">${data.weather[0].description}</p>
                            <p class="_weatherCityName">${city.name}</p>
                            <span class="_weatherDate">${weekDays[day.getDay()]}, ${day.getDate()} ${month[day.getMonth()]}</span>
                        </div>    
                        <div class="col-xs-4 _weatherAllInfo">
                            <p>Pressure: ${data.pressure}, hPa</p>
                            <p>Humidity : ${data.humidity} %</p>
                            <p>Wind: ${data.speed} meter/sec</p>
                            <p>Cloudiness : ${data.clouds} %</p>
                        </div>                                                                                     
                      </div>`
}
function tabTomorrow(data, city) {
    let days = setDate()
    let imgUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
    let day = days[1]
    let tab = document.querySelector("#weather #tomorrow")
    tab.innerHTML = `<div class="row">
                        <img src=${imgUrl} class="_weatherImg col-xs-3" alt="">
                        <div class="col-xs-5">
                            <p class="_weatherTemperature">${Math.round(data.temp.eve)}&#8451;                       
                                <span>Max: ${Math.round(data.temp.max)}&#8451</span>
                                <span>Min: ${Math.round(data.temp.min)}&#8451</span>    
                            </p>   
                            <p class="_weatherDesc">${data.weather[0].description}</p>
                            <p class="_weatherCityName">${city.name}</p>
                            <span class="_weatherDate">${weekDays[day.getDay()]}, ${day.getDate()} ${month[day.getMonth()]}</span>
                        </div>    
                        <div class="col-xs-4 _weatherAllInfo">
                            <p>Pressure: ${data.pressure}, hPa</p>
                            <p>Humidity : ${data.humidity} %</p>
                            <p>Wind: ${data.speed} meter/sec</p>
                            <p>Cloudiness : ${data.clouds} %</p>
                        </div>                                                                                     
                      </div>`
}
function tabFiveDays(data) {
    let days = setDate()
    let arrayWeather = days.map( ( day, i ) => {
        return `<div class="col-xs-2 col-xs-push-1">
                    <p>${day.getDate()} ${month[day.getMonth()]}</p>
                    <p>${weekDays[day.getDay()]}</p>                 
                    <p><img src=http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png ></p>
                    <p>${Math.round(data.list[i].temp.max)}&#8451</p>
                    <p>${Math.round(data.list[i].temp.min)}&#8451</p> 
                </div>`
    })
    let tab = document.querySelector("#weather #allDays")
    tab.innerHTML = `<div class="row">
                        ${arrayWeather.join("")}
                    </div>`
}