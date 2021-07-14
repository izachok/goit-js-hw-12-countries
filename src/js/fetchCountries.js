export default function fetchCountries(searchQuery) {
  return fetch(
    `https://restcountries.eu/rest/v2/name/${searchQuery}?fields=name;capital;population;flag;languages`,
  )
    .then(r => {
      if (r.ok) return r.json();
      return { countries: [] };
    })
    .catch(err => {
      throw new Error(err.message);
    });
}
