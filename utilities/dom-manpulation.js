import isObject from 'lodash/isObject';

const setAttributes = (element, attributes) => {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
};

export const createElement = (
  value,
  { tagName, classList, className, ...attributes } = {
    tagName: 'article',
    classList: [],
  },
) => {
  const element = document.createElement(tagName || 'div');

  if (Array.isArray(classList)) element.classList.add(...classList);
  if (className) element.className = className;

  setAttributes(element, attributes);

  if (typeof value !== 'string' && typeof value !== 'number') {
    value = JSON.stringify(value, null, 2);
    element.innerHTML = `<pre class="raw"><code>${value}</code></pre>`;
    return element;
  }

  element.innerText = value;
  return element;
};

export const addElementToDOM = (target, value, attributes) => {
  const element = createElement(value, attributes);
  target.appendChild(element);
};

export const emptyElement = (target) => {
  target.innerText = '';
};

export const emptyElements = (targets) => {
  if (Array.isArray(targets)) return targets.forEach(emptyElement);
  if (isObject) return emptyElements(Object.values(targets));
};
