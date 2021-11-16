import './style.scss';

export const canvas = document.getElementById('canvas');
export const color = document.getElementById('color');
export const panel = document.getElementById('panel');

export const ctx = canvas.getContext('2d');

export const roundDown = (n) => Math.floor(n / 10) * 10;
export const roundDownPoints = (points) => points.map(roundDown);
export const pointsAreEqual = (previous, current) => {
  return previous[0] === current[0] && previous[1] === current[1];
};

export const getCoordinates = (event) => [event.offsetX, event.offsetY];

export const drawLine = ([point, color]) => {
  const [x, y] = point;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 10, 10);
};

export const drawCircle = ([points, color]) => {
  ctx.fillStyle = color;
  const [startX, startY] = points.start;
  const [currentX, currentY] = points.current;

  ctx.beginPath();
  ctx.arc(
    startX,
    startY,
    Math.abs(Math.ceil(startX - currentX, startY - currentY)),
    0,
    2 * Math.PI,
    false,
  );
  ctx.fill();
};
