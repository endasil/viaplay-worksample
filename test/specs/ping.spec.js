const { expect } = require('chai');
const request = require('request');
require('node-auto-mock').init();

const {
  LISTEN_PORT,
} = require('../../src/utils/config');
const server = require('../../src/server');

describe('/ping', () => {
  before((done) => {
    server.startServer(done);
  });

  after((done) => {
    server.stopServer(done);
  });

  afterEach(() => {
  });

  it.useMock('ping should return 200', (done) => {
    request(
      `http://localhost:${LISTEN_PORT}/ping`,
      (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      },
    );
  });
});
