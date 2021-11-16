import { addElementToDOM } from '../../utilities/dom-manpulation';
import './style.scss';

export const form = document.getElementById('fetch-form');
export const search = document.getElementById('search');
export const submit = document.getElementById('fetch');
export const results = document.getElementById('results');

export const clearResults = () => (results.innerText = '');
export const addResults = ({ pokemon }) => pokemon.forEach(addResult);
export const addResult = (result) => {
  addElementToDOM(results, result.name);
};

export const addPokemon = (pokemon) => {
  addElementToDOM(results, pokemon);
};

export const endpoint = 'http://localhost:3333/api/pokemon/search/';
export const endpointFor = (id) => 'http://localhost:3333/api/pokemon/' + id;

form.addEventListener('submit', (event) => event.preventDefault());
