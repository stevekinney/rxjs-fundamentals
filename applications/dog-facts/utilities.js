export const errorStatus = document.getElementById('error');
export const fetchButton = document.getElementById('get-dog-facts');
export const stopButton = document.getElementById('stop-dog-facts');
export const factsSection = document.getElementById('dog-facts');

export const createFact = (fact) => {
  const element = document.createElement('article');
  element.innerText = fact;
  return element;
};

export const clearFacts = () => {
  factsSection.innerText = '';
};

export const setError = (error) => {
  errorStatus.innerText = error;
};

export const clearError = () => {
  errorStatus.innerText = '';
};

export const addFact = ({ fact }) => factsSection.appendChild(createFact(fact));
export const addFacts = (data) => data.forEach(addFact);

export const endpoint = 'https://localhost:3333/api/facts';
