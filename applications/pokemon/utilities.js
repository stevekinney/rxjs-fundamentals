import { EMPTY, NEVER } from 'rxjs';
import { addElementToDOM } from '../../utilities/dom-manpulation';
import './style.scss';

export const form = document.getElementById('fetch-form');
export const search = document.getElementById('search');
export const submit = document.getElementById('fetch');
export const results = document.getElementById('results');
export const pokemonView = document.getElementById('pokemon');

export const clearResults = () => (results.innerText = '');
export const addResults = (response) => response.forEach(addResult);
export const addResult = (result) => {
  addElementToDOM(results, result);
};

export const renderPokemon = (pokemon) => {
  pokemonView.innerHTML = `
    <header><h2>${pokemon.name}</h2></header>
    <p class="type">${pokemon.classification}</p>
    <div class="data">${renderData(pokemon)}</div>
  `;
};

const renderData = ({ data }) => {
  if (!data) return 'Loading additional data…';

  return `
    <h3>Abilities</h3>

    <ul>
      ${data.abilities.map((ability) => `<li>${ability}</li>`).join('\n')}
    </ul>

    <table class="pokemon-data-table">
      <thead>
          <tr>
              <th>
                Hit Points
              </th>
              <th>
                Height
              </th>
              <th>
                Weight
              </th>
              <th>
                Speed
              </th>
          <tr>
      </thead>
      <tbody>
        <tr>
            <td>
              ${data.hp}
            </td>
            <td>
              ${data.height_m}
            </td>
            <td>
              ${data.weight_kg}
            </td>
            <td>
              ${data.speed}
            </td>
          <tr>
      </tbody>
    </table>
  `;
};

export const addDataToPokemon = (pokemon, data) => {
  return data;
};

export const endpoint = 'http://localhost:3333/api/pokemon/search/';
export const endpointFor = (id) =>
  'http://localhost:3333/api/pokemon/' + id + '?delay=2000';

form.addEventListener('submit', (event) => event.preventDefault());
