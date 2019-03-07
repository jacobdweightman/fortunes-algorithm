const VertexEvent = require('../js/vertexevent.js');
const Site = require('../js/site.js');
const Segment = require('../js/segment.js');

test('circumcircle is correctly computed', () => {
  let a = new Segment(new Site(150, 300));
  let b = new Segment(new Site(450, 300));
  let c = new Segment(new Site(350, 150));

  let ve = new VertexEvent(a, b, c);

  expect(ve.x).toBeCloseTo(300);
  expect(ve.y - ve.r).toBeCloseTo(875/3);
  expect(ve.r).toBeCloseTo(150.231);

  a = new Segment(new Site(4, 78));
  b = new Segment(new Site(86, 84));
  c = new Segment(new Site(88, 37));

  ve = new VertexEvent(a, b, c);

  expect(ve.x).toBeCloseTo(46.626);
  expect(ve.y - ve.r).toBeCloseTo(58.782);
  expect(ve.r).toBeCloseTo(46.758);
});

/*test('remaining vertex events of the removed segment are removed', () => {
  expect(0).toBe(1);
});

test('possible new vertex events are created', () => {
  expect(0).toBe(1);
});*/
