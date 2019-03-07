const dcel = require('../js/dcel.js');

test('DCEL Vertex has correct fields', () => {
  let v = new dcel.Vertex(3, 5);

  expect(v.x).toBe(3);
  expect(v.y).toBe(5);
});

/*test('DCEL Edge has correct fields', () => {
  expect(0).toBe(1);
});

test('DCEL Face has correct fields', () => {
  expect(0).toBe(1);
});

test('DCEL is initialized properly', () => {
  expect(0).toBe(1);
});

test('Vertices can be added to a DCEL', () => {
  expect(0).toBe(1);
});

test('DCEL Faces can be created by splitting', () => {
  expect(0).toBe(1);
});*/
