import { tap, of, delay } from 'rxjs';
import './style.scss';

export const form = document.querySelector('form');

export const loadingStatus = document.getElementById('loading-status');
export const responseTimeField = document.getElementById('response-time');
export const showLoadingAfterField =
  document.getElementById('show-loading-after');
export const showLoadingForAtLeastField = document.getElementById(
  'show-loading-for-at-least',
);

export const fetchData = () => {
  const responseTime = +responseTimeField.value;
  const showAfter = +showLoadingAfterField.value;
  const showFor = +showLoadingForAtLeastField.value;

  return of(true).pipe(
    tap(() => console.log('Fetching…', responseTime)),
    delay(responseTime),
    tap(() => {
      console.log('Data: Recieved');
    }),
  );
};

export const showLoading = (loading) => {
  console.log({ loading });
  if (loading) {
    loadingStatus.innerHTML = '<div class="currently-loading">Loading…</div>';
  } else {
    loadingStatus.innerHTML = '';
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
});
