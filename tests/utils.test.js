const cross = require('../js/utils.js');
const dcel = require('../js/dcel.js');

test('cross utility correctly identifies the orientation of points', () => {
  let a = new dcel.Vertex(1, 1);
  let b = new dcel.Vertex(5, 1);
  let c = new dcel.Vertex(3, 3);

  expect(cross(a,b,c)).toBeGreaterThan(0);
  expect(cross(a,c,b)).toBeLessThan(0);
  expect(cross(b,a,c)).toBeLessThan(0);
  expect(cross(b,c,a)).toBeGreaterThan(0);
  expect(cross(c,a,b)).toBeGreaterThan(0);
  expect(cross(c,b,a)).toBeLessThan(0);

  a = new dcel.Vertex(2, 1);
  b = new dcel.Vertex(4, 3);
  c = new dcel.Vertex(6, 5);

  expect(cross(a,b,c)).toBe(0);
  expect(cross(a,c,b)).toBe(0);
  expect(cross(b,a,c)).toBe(0);
  expect(cross(b,c,a)).toBe(0);
  expect(cross(c,a,b)).toBe(0);
  expect(cross(c,b,a)).toBe(0);
});
