const BeachLineTree = require('../js/BeachLineTree.js');
const Site = require('../js/site.js');

test('can find neighboring segments', () => {
  let blt = new BeachLineTree();
  blt.setRoot(new Site(100, 100));
  let [l,c,r] = blt.split(blt.root, new Site(300, 100));

  expect(l.next()).toBe(c);
  expect(c.next()).toBe(r);
  expect(r.prev()).toBe(c);
  expect(c.prev()).toBe(l);

  let [l2,c2,r2] = blt.split(r, new Site(350, 125));

  expect(l.next()).toBe(c);
  expect(c.next()).toBe(l2);
  expect(l2.next()).toBe(c2);
  expect(c2.next()).toBe(r2);
  expect(r2.prev()).toBe(c2);
  expect(c2.prev()).toBe(l2);
  expect(l2.prev()).toBe(c);
  expect(c.prev()).toBe(l);
});
