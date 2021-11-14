import { fromEvent } from 'rxjs';
import {
  createElement,
  addElementToDOM,
  emptyElement,
} from '../../utilities/dom-manpulation';
import { characters } from './star-wars-characters.json';

export { setStatus } from '../merging-timelines/utilities';

export const startButton = document.getElementById('start');
export const pauseButton = document.getElementById('pause');
export const clearButton = document.getElementById('clear');
export const status = document.getElementById('status');
export const output = document.getElementById('output');

export const getCharacter = (id) => {
  return new Promise((resolve, reject) => {
    const character = characters.find((character) => character.id === id);
    if (character) {
      resolve(character);
    } else {
      reject({ error: 'Not found.' });
    }
  });
};

const beatles = ['John', 'Paul', 'George', 'Ringo'];

const includesABeatle = (value) => {
  for (const beatle of beatles) {
    if (String(value).includes(beatle)) return true;
  }
  return false;
};

export const render = (value) => {
  const classList = ['stream-element'];

  console.log(value);

  if (includesABeatle(value)) classList.push('stream-' + value.toLowerCase());

  addElementToDOM(output, value, { classList });
};

fromEvent(clearButton, 'click').subscribe(() => emptyElement(output));
