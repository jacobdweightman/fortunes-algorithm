const BeachLineTree = require('../js/BeachLineTree.js');
const Site = require('../js/site.js');
const Segment = require('../js/segment.js');
const Breakpoint = require('../js/Breakpoint.js');

test('computes location of breakpoints', () => {
  // equal y-coordinate - breakpoint is halfway between sites
  let blt = new BeachLineTree();
  blt.setRoot(new Site(100, 100));
  blt.split(blt.root, new Site(300, 100));

  expect(blt.root.compute(120)).toBe(200);

  // unequal y-coordinate - should be closer to y=200 site
  blt = new BeachLineTree();
  blt.setRoot(new Site(100, 100));
  blt.split(blt.root, new Site(300, 200));

  expect(blt.root.compute(220)).toBeGreaterThan(200);
});
