import { fromEvent } from 'rxjs';
import {
  createElement,
  addElementToDOM,
  emptyElement,
} from '../../utilities/dom-manpulation';
import { characters } from './star-wars-characters.json';

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

export const setStatus = (isRunning) => {
  if (isRunning) {
    status.innerText = 'Running…';
    startButton.disabled = true;
    pauseButton.disabled = false;
  } else {
    status.innerText = 'Paused.';
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
};

const beatles = ['John', 'Paul', 'George', 'Ringo'];

const findBeatle = (value) => {
  for (const beatle of beatles) {
    const match = String(value).match(beatle);
    if (match) return match[0].toLowerCase();
  }
  return false;
};

export const render = (value) => {
  const classList = ['stream-element'];
  const beatle = findBeatle(value);

  console.log(value);

  if (beatle) classList.push('stream-' + beatle);

  addElementToDOM(output, value, { classList });
};

fromEvent(clearButton, 'click').subscribe(() => emptyElement(output));
