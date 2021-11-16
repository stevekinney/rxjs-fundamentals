import { fromEvent, interval } from 'rxjs';

export const count = document.querySelector('.count');
export const startButton = document.getElementById('start');
export const pauseButton = document.getElementById('pause');

export const setCount = (value) => {
  count.innerText = value;
};
