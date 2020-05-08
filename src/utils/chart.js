import { scaleTime, scaleLinear } from 'd3-scale';

export const calculateChart = (points, {width, height, padding}) => {
  const maxY = Math.max.apply(null, points.map(p => p.y));
  const minY = Math.min.apply(null, points.map(p => p.y));

  const minX = points[0].x;
  const maxX = points[points.length - 1].x;

  const xScale = scaleTime()
    .domain([new Date(minX), new Date(maxX)])
    .range([padding.left, width - padding.right]);

  const yTicks = [0.9 * minY, minY, maxY, maxY * 1.1];

  const yScale = scaleLinear()
    .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
    .range([height - padding.bottom, padding.top]);

  const xTicks = xScale.ticks(8);

  return {
    xScale,
    yScale,
    xTicks,
    yTicks,
    maxY,
    minY,
    minX,
    maxX,
  }
}

export const calculatePath = points => `M${points.map(p => `${p.x},${p.y}`).join('L')}`;

export const calculateArea = (path, { xScale, maxX, yScale, minY, minX }) => `${path}L${xScale(new Date(maxX))},${yScale(minY * 0.9)}L${xScale(new Date(minX))},${yScale(minY * 0.9)}Z`; 

export const getScaledPoints = (points, { xScale, yScale }) => points.map(p => ({ x: xScale(new Date(p.x)), y: yScale(p.y) }));
