const form = document.getElementById('form');

export const loadingStatus = document.getElementById('loading-status');
export const responseTimeField = document.getElementById('response-time');
export const showLoadingAfterField =
  document.getElementById('show-loading-after');
export const showLoadingForAtLeastField = document.getElementById(
  'show-loading-for-at-least',
);

form.addEventListener((event) => event.preventDefault());
