import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import '../node_modules/lodash.debounce';
import _ from 'lodash';

const searchParam = {
  DEBOUNCE_DELAY: 300,
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  country: document.querySelector('.country-info'),
};
let query;
const searchCountry = e => {
  query = searchParam.input.value.trim();
  clearInput();
  fetchCountries(query)
    .then(country => {
      createSearch(country);
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

searchParam.input.addEventListener('input', _.debounce(searchCountry, searchParam.DEBOUNCE_DELAY));

function createSearch(country) {
  if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (country.length >= 2 && country.length <= 10) {
    const markup = country
      .map(country => {
        return `<li class="country-item" id="${country.name}" >
        <img class="country-flag" src="${country.flag}" alt="${country.name}" style = "width: 50px"> ${country.name}
        </li>`;
      })
      .join('');
    searchParam.countryList.innerHTML = markup;
    return markup;
  } else if (country.length === 1) {
    const markupItem = country
      .map(country => {
        return `<li class="country-item" id="${country.name}" style = "list-style: none">
        <img class="country-flag" src="${country.flag}" alt="${
          country.name
        }" style = "width: 200px">
          <div class="descr-wrapper">
            <p class="descr">
              <span class="oleg">Capital: </span>
              <span >${country.capital}</span>
            </p>
            <p class="descr">
              <span class="oleg">Population: </span>
              <span>${country.population}</span>
            </p>
            <p class="descr">
              <span class="oleg">Language: </span>
              ${
                country.languages.length > 1
                  ? `<ul class ="language_list"> 
                ${country.languages
                  .map(language => {
                    return `<li class = "language_item">${language.name}</li>`;
                  })
                  .join('')}
                </ul>`
                  : `${country.languages[0].name}`
              }
            </p>
          </div>
        </li>`;
      })
      .join('');
    searchParam.countryList.innerHTML = markupItem;
  }
}

function clearInput() {
  if (searchParam.countryList.children.length) {
    searchParam.countryList.innerHTML = '';
  }
}
