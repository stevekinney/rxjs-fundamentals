export const form = document.getElementById('fetch-form');
export const search = document.getElementById('search');
export const submit = document.getElementById('fetch');
export const results = document.getElementById('results');

export const clearResults = () => (results.innerText = '');
export const addResults = (results) => results.forEach(addResult);
export const addResult = (result) => {
  const element = document.createElement('article');
  element.innerText = result.name;
  results.appendChild(element);
};

export const endpoint = 'https://rxjs-api.glitch.me/api/pokemon/search/';
export const endpointFor = (id) =>
  'https://rxjs-api.glitch.me/api/pokemon/' + id;

form.addEventListener('submit', (event) => event.preventDefault());
