import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt();

export const deepThoughtInput = document.getElementById('deep-thought');
export const deepThoughtRendered = document.getElementById(
  'deep-thought-rendered',
);
export const deepThroughtStatus = document.getElementById(
  'deep-thought-status',
);

export const renderMarkdown = (content) => {
  deepThoughtRendered.innerHTML = markdown.render(content);
};

export const setStatus = (content) => {
  deepThroughtStatus.innerHTML = content;
};
