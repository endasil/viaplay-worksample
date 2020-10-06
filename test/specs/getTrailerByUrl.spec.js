const log = require('why-is-node-running'); // sh
const { expect } = require('chai');
const request = require('request');
require('node-auto-mock').init();

// Reduce log spam while testing
process.env.LOG_LEVEL = 'error';
const {
  LISTEN_PORT,
} = require('../../src/utils/config');
const server = require('../../src/server');

describe('/getTrailerByUrl', () => {
  // setTimeout(function () {
  //     log() // logs out active handles that are keeping node running
  // }, 100);

  before((done) => {
    server.startServer(done);
  });

  after((done) => {
    server.stopServer(done);
  });

  afterEach(() => {
  });

  it.useMock('should return the trailer for bloodshot-2020 from mock in first call. Second call from cache. Third call fail with nock no match for request.', (done) => {
    // We have a mock for this call, should return without problem.
    request(
      `http://localhost:${LISTEN_PORT}/film/trailer/url/https%3A%2F%2Fcontent.viaplay.se%2Fpc-se%2Ffilm%2Fbloodshot-2020`,
      (error, response, body) => {
        expect(body).to.equal('"https://www.youtube.com/watch?v=F95Fk255I4M"');

        // We have only recorded a response for one call to the endpoint, so a second call would fail if not cached.
        request(
          `http://localhost:${LISTEN_PORT}/film/trailer/url/https%3A%2F%2Fcontent.viaplay.se%2Fpc-se%2Ffilm%2Fbloodshot-2020`,
          (error, response, body) => {
            expect(body).to.equal('"https://www.youtube.com/watch?v=F95Fk255I4M"');

            // Since no call has been made to request the movie DUMMY, there is no cache for this so a nock error
            // is returned. This also verifies that blocking of external calls is active in the tests.
            request(
              `http://localhost:${LISTEN_PORT}/film/trailer/url/https%3A%2F%2Fcontent.viaplay.se%2Fpc-se%2Ffilm%2FDUMMY`,
              (error, response, body) => {
                expect(body).to.contain('Nock: No match for request');
                done();
              },
            );
          },
        );
      },
    );
  });

  it.useMock('requesting the movie dummy should return HttpStatus code 404 and the message should contain 5100', (done) => {
    request(
      `http://localhost:${LISTEN_PORT}/film/trailer/url/https%3A%2F%2Fcontent.viaplay.se%2Fpc-se%2Ffilm%2Fbdummy`,
      (error, response, body) => {
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.include('5100');
        done();
      },
    );
  });
});
