import '../sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/country-list.hbs';

import { error } from '@pnotify/core';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const refs = {
  countriesContainer: document.querySelector('.result-wrapper'),
  searchInput: document.querySelector('#search'),
};

refs.searchInput.addEventListener('input', debounce(searchCountries, 500));

function searchCountries(event) {
  const searchQuery = event.target.value.trim();
  if (!searchQuery) {
    clearCountryContainer();
    return;
  }

  fetchCountries(searchQuery).then(analyseCountires).catch(onFetchError);
}

function onFetchError() {
  showErrorNotification('Something went wrong. Please try other combination.');
}

function analyseCountires(countries) {
  if (countries.length > 1 && countries.length <= 10) {
    renderCountriesList(countries);
    return;
  }

  if (countries.length > 10) {
    showErrorNotification();
    return;
  }
  if (countries.length === 1) {
    renderCountryCard(countries[0]);
    return;
  }
  showErrorNotification('Oops, there is no country with that name');
}

function renderCountryCard(country) {
  refs.countriesContainer.innerHTML = countryCardTpl(country);
}

function renderCountriesList(countries) {
  refs.countriesContainer.innerHTML = countryListTpl(countries);
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
