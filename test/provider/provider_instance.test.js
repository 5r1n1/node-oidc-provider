const Provider = require('../../lib');
const { expect } = require('chai');
const sinon = require('sinon');

describe('provider instance', function () {
  context('when in non test environment', function () {
    /* eslint-disable no-console */
    before(function () {
      delete process.env.NODE_ENV;
      sinon.stub(console, 'info').callsFake(() => {});
    });
    after(function () {
      process.env.NODE_ENV = 'test';
      console.info.restore();
    });

    it('it warns when draft/experimental specs are enabled', function () {
      new Provider('http://localhost', { // eslint-disable-line no-new
        features: { sessionManagement: true }
      });

      expect(console.info.called).to.be.true;
    });
    /* eslint-enable */
  });

  describe('#initialize', function () {
    it('does not allow to be initialized twice', function (done) {
      const provider = new Provider('http://localhost');
      provider.initialize().then(() => {
        expect(function () { provider.initialize(); }).to.throw('already initialized');
        done();
      });
    });
  });

  describe('#urlFor', function () {
    it('returns the route for unprefixed issuers', function () {
      const provider = new Provider('http://localhost');
      return provider.initialize({}).then(function () {
        expect(provider.urlFor('authorization')).to.equal('http://localhost/auth');
      });
    });

    it('returns the route for prefixed issuers', function () {
      const provider = new Provider('http://localhost/op/2.0');
      return provider.initialize({}).then(function () {
        expect(provider.urlFor('authorization')).to.equal('http://localhost/op/2.0/auth');
      });
    });

    it('passes the options', function () {
      const provider = new Provider('http://localhost');
      return provider.initialize({}).then(function () {
        expect(provider.urlFor('resume', { grant: 'foo' })).to.equal('http://localhost/auth/foo');
      });
    });
  });
});
