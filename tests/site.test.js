const BeachLineTree = require('../js/BeachLineTree.js');
const Site = require('../js/site.js');

test('Site events create the proper vertex events', () => {
  let blt = new BeachLineTree();

  let a = new Site(100, 100);
  let b = new Site(400, 100);
  let c = new Site(300, 200);

  a.process(blt);
  

  expect(0).toBe(1);
});
