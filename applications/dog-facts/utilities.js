import { createElement } from '../../utilities/dom-manpulation';
import './style.scss';

export const errorStatus = document.getElementById('error');
export const fetchButton = document.getElementById('get-dog-facts');
export const stopButton = document.getElementById('stop-dog-facts');
export const factsSection = document.getElementById('dog-facts');

export const clearFacts = () => {
  factsSection.innerText = '';
};

export const setError = (error) => {
  errorStatus.innerText = error;
};

export const clearError = () => {
  errorStatus.innerText = '';
};

export const addFact = ({ fact }) => {
  factsSection.appendChild(createElement(fact, { classList: ['dog-fact'] }));
};
export const addFacts = (data) => data.facts.forEach(addFact);

export const endpoint = 'https://localhost:3333/api/facts';
