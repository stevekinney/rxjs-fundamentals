import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt();
export const renderMarkdown = markdown.render;

export const button = document.getElementById('create-notification');
export const panicButton = document.getElementById('panic-button');
export const deepThoughtInput = document.getElementById('deep-thought');
export const deepThoughtRendered = document.getElementById(
  'deep-thought-rendered',
);
export const deepThroughtStatus = document.getElementById(
  'deep-thought-status',
);

export const createNotificationElement = () => {
  const element = document.createElement('article');
  element.innerText = 'Something happened.';
  return element;
};

export const addMessageToDOM = () => {
  const notification = createNotificationElement();
  notificationMessages.appendChild(notification);
};

export const setTextArea = (content) => {
  deepThoughtRendered.innerHTML = content;
};

export const setStatus = (content) => {
  deepThroughtStatus.innerHTML = content;
};
