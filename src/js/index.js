import '../sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
import countryCardTpl from '../templates/country-card.hbs';

import { error } from '@pnotify/core';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const refs = {
  countriesContainer: document.querySelector('.result-wrapper'),
  searchInput: document.querySelector('#search'),
};

refs.searchInput.addEventListener('input', debounce(searchCountries, 500));

function searchCountries(event) {
  if (!event.target.value.trim()) {
    clearCountryContainer();
    return;
  }

  fetchCountries(event.target.value).then(analyseCountires).catch(onFetchError);
}

function onFetchError() {
  showErrorNotification('Something went wrong. Please try other combination.');
}

function analyseCountires(countries) {
  if (countries.length > 10) {
    showErrorNotification();
    return;
  }
  if (countries.length === 1) {
    renderCountryCard(countries[0]);
    return;
  }

  renderCountriesList(countries);
}

function renderCountryCard(country) {
  refs.countriesContainer.innerHTML = countryCardTpl(country);
}

function renderCountriesList(countries) {
  refs.countriesContainer.innerHTML = `<ul>${countries
    .map(country => `<li>${country.name}</li>`)
    .join('')}</ul>`;
}

function clearCountryContainer() {
  refs.countriesContainer.innerHTML = '';
}

function showErrorNotification(
  message = 'Too many matches found. Please enter a more specific query!',
) {
  clearCountryContainer();
  error({
    text: message,
    delay: 1000,
    sticker: false,
    closer: false,
  });
}
