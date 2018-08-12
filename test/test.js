const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

// Require knex and bookshelf for testing purposes.
const config = require('../knexfile');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
// Require and Load the bookshelf protected columns plugin
const plugin = require('../index');
bookshelf.plugin(plugin);

describe('bookshelf-protected-columns', function() {
  var TestModel;

  before(async function() {
    TestModel = bookshelf.Model.extend({
      tableName: 'users',
      protected_columns: ['protected']
    });
    return knex.migrate.latest();
  });

  after(async function() {
    return knex.destroy();
  });

  describe('Protection of columns', function() {
    beforeEach(async function() {
      return knex.seed.run();
    });

    it('should not update the protected column', async function() {
        let user = await TestModel.where('name', 'Lucas').fetch({ require: true });
        user.set('protected', 'something else');
        user = await user.save();
        user.get('protected').should.not.equal('something else');
        user.get('protected').should.equal('this shouldn\'t change');
    });

    it('should update an unprotected column', async function() {
      let user = await TestModel.where('name', 'Lucas').fetch({ require: true });
      user.set('address', '123 New Street');
      user = await user.save();
      user.get('address').should.not.equal('123 Super Street');
      user.get('address').should.equal('123 New Street');
    })
  });

  describe('Force updating of protected columns', function() {
    this.beforeEach(async function() {
      return knex.seed.run();
    });
    
    it('should update a protected column', async function() {
      let user = await TestModel.where('name', 'Lucas').fetch({ require: true });
      user.set('protected', 'something else');
      user = await user.forceUpdate();
      user.get('protected').should.equal('something else');
      user.get('protected').should.not.equal('this shouldn\'t change');
    });

    it('should update non-protected columns as well', async function () {
      let user = await TestModel.where('name', 'Lucas').fetch({ require: true });
      user.set('protected', 'something else');
      user.set('name', 'Johno');
      user = await user.forceUpdate();
      user.get('protected').should.equal('something else');
      user.get('protected').should.not.equal('this shouldn\'t change');
      user.get('name').should.equal('Johno');
      user.get('name').should.not.equal('Lucas');
    });

    it('should still fail to update on a normal save', async function() {
      let user = await TestModel.where('name', 'Lucas').fetch({ require: true });
      user.set('protected', 'something else');
      user.set('name', 'Johno');
      user = await user.forceUpdate();
      user.get('protected').should.equal('something else');
      user.get('protected').should.not.equal('this shouldn\'t change');
      user.get('name').should.equal('Johno');
      user.get('name').should.not.equal('Lucas');
      // Normal save after force update to verify
      user.set('protected', 'should be protected');
      user = await user.save();
      user.get('protected').should.not.equal('should be protected');
      user.get('protected').should.equal('something else');
    });
  });
});
