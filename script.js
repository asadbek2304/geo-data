'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const input = document.querySelector('.input')

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>Aholi</span>${+(data.population / 1000000)}</p>
            <p class="country__row"><span>Til</span>${data.languages[0].name}</p>
            <p class="country__row"><span>Pul birligi</span>${data.currencies[0].name}</p>
          </div>
        </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function(msg){
  countriesContainer.insertAdjacentText('beforeend', msg)
}

//////////Eski XMLHttpRequest metodi////////
// const CountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`
//   );

//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);

//     const borders = data.borders;

//     if (!borders) return;
//     let request2;
//     borders.forEach(count => {
//       request2 = new XMLHttpRequest();
//       request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${count}`
//       );
//       request2.send();

//       request2.addEventListener('load', function () {
//         const data2 = JSON.parse(this.responseText);

//         renderCountry(data2, 'neighbour')
//       })
//     })
//   });
// }

// CountryData('uzbekistan');

// const requestFetch = fetch(`https://restcountries.eu/rest/v2/name/uzbekistan`);
// console.log(requestFetch);

//////fetch metodi (ancha yaxshiroq)///////

const eroorJSON = function(url, errorMsg = 'Something went wrong'){
  return fetch(url)
  .then(response => {

    if(!response.ok) throw new Error(errorMsg)
    
    return response.json()
  
  })
}
const getCoutryData = function(country){
  eroorJSON(`https://restcountries.eu/rest/v2/name/${country}`, `Country not found`)

  .then(data => {renderCountry(data[0])
  let neighbour = data[0].borders[0];
  // console.log(neighbour)

  if(!neighbour) return;


    return eroorJSON(`https://restcountries.eu/rest/v2/alpha/${neighbour}`, `Country not found`)
   
  })
  .then(data1 => renderCountry(data1, 'neighbour'))
  .catch(err => {console.error(`${err.message} xaxaa battar bo'l!`)
  renderError(`Something went wrong ${err.message}`)
})
.finally(() =>{
  countriesContainer.style.opacity = 1
})
};

btn.addEventListener('click', function(){
  getCoutryData(`${input.value}`)
  
})
