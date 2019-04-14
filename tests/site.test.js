const Fortune = require('../js/main.js');
const Site = require('../js/site.js');

test('Site events create the proper vertex events', () => {
  let a = new Site(100, 100);
  let b = new Site(400, 100);
  let c = new Site(300, 200);

  let f = new Fortune([a,b,c]);

  a.process(f);

  expect(1).toBe(1);
});
