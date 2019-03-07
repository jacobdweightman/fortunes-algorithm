const BeachLineTree = require('../js/BeachLineTree.js');

test('BeachLineTree constructor sets correct defaults', () => {
  var blt = new BeachLineTree();

  expect(blt.leaves).toBe(0);
  expect(blt.root).toBe(undefined);
});

test('BeachLineTree correctly finds segment above a given point', () => {
  expect(0).toBe(1);
});

test('BeachLineTree correctly splits segments when new segments are added', () => {
  expect(0).toBe(1);
});

test('BeachLineTree correclty removes segments', () => {
  expect(0).toBe(1);
});

test('BeachLineTree can generate in-order traversal', () => {
  expect(0).toBe(1);
});
