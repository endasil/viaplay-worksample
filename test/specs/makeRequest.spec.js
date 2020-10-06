const nock = require('nock');
const {expect} = require('chai');
assert = require('assert');
nock.disableNetConnect();
const makeRequest = require('../../src/utils/makeRequest');

describe('makeRequest', () => {

    it('First response should use nocked value,  second request should take value from cache and not fail.', (done) => {
        nock('http://google.com')
            .get('/data')
            .reply(200, {tomte: 'dummy'});

        makeRequest({url: 'http://google.com/data', useCache: true}).then(() => {
            makeRequest({url: 'http://google.com/data', useCache: true}).then(() => {
                done();
            });
        });
    });

    it('should return JSON', (done) => {
        nock('http://google.com')
            .get('/data')
            .reply(200, {tomte: 'dummy'});

        makeRequest({url: 'http://google.com/data'}).then((data) => {
            expect(data.body).to.deep.equal({tomte: 'dummy'});
            done();
        }).catch((err) => {
            assert.fail(err);
            done(err);
        });
    });

    it('should reject if server responds with error HTTP code', (done) => {
        // align
        nock('http://google.com')
            .get('/data')
            .reply(404, 'error from server');

        // act
        makeRequest({url: 'http://google.com/data'}).then((data) => {
              assert.fail();
            done();
        }).catch((err) => {
          expect(err.statusCode).to.equal(404);
          expect(err.message).to.equal('error from server');
          done();
        });
    });
});
