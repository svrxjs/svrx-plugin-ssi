const path = require('path');
const request = require('supertest');

const svrx = require('@svrx/svrx');

describe('e2e', () => {
  const factory = svrx({
    root: path.join(__dirname, '../example/basic'),
    plugins: [
      {
        name: 'ssi',
        path: path.join(__dirname, '../index.js'),
      },
    ],
  });
  const instance = factory.__svrx;

  before((done) => {
    instance.setup().then(done);
  });

  it('basic e2e should work', (done) => {
    request(instance.callback())
      .get('/')
      .expect(/<header>Top<\/header/, (err) => {
        if (err) return done(err);
        return request(instance.callback())
          .get('/index.html')
          .expect(/Bottom/, done);
      });
  });
  it('case without include', (done) => {
    request(instance.callback())
      .get('/bottom.html')
      .expect(/Bottom/, done);
  });
  it('case with file undefound', (done) => {
    request(instance.callback())
      .get('/error.html')
      .expect(/Top/, done);
  });
  it('case with file outside', (done) => {
    request(instance.callback())
      .get('/index_out.html')
      .expect(/Out/, done);
  });
});
