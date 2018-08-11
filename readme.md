# Bookshelf Protected Columns
This bookshelf plugin allows a user to specify which columns they wish to be immutable or protected,
the plugin reads these columns from the Model's `protected_columns` property which is set to undefined by
default. In order to achieve this we register an event to the Models updating event that tells it to set the 
currnt attribute back to it's previous attribute if it's within the protected_columns array.

## Installation with NPM
`npm i bookshelf-protected-columns --save`

## Example usage

#### Bookshelf.js
```js
const knex = require('knex')(require('./knexfile'));
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('bookshelf-protected-columns');
module.exports = bookshelf;
```

#### Model.js
```js
const bookshelf = require('../bookshelf');

const Event = bookshelf.Model.extend({
  tableName: 'table_name',
  hasTimestamps: true,
  protected_columns: ['name', 'created_at'],
});

module.exports = bookshelf.model('Event', Event);
```

#### Controller.js
```js
const Model = require('./model');

// req.body = { name: "New Name", description: "Updated" }
const update = async (req, res) => {
  try {
    // model.attributes = { name: "Name", description: "Original" }
    let model = await Model.where('name', req.params.name).fetch();
    Object.keys(req.body).forEach((key) => {
      model.set(key, req.body[key]); // Will silently fail on { name: "New Name" }
    });

    model = await model.save(); // model.attribute = { name: "Name", description: "Updated" }

    return res.json(model);
  } catch(e) {
    return res.json({
      errors: e
    });
  }
}
```

## What if I want to force an update?
This plugin will allow you to force update a model by using the `forceUpdate()` method.
This method is a wrapper around the models `save()` method that simply disables the protection
event.

### Example
```js
const Model = require('./model');

// req.body = { name: "New Name", description: "Updated" }
const update = async (req, res) => {
  try {
    // model.attributes = { name: "Name", description: "Original" }
    let model = await Model.where('name', req.params.name).fetch();
    Object.keys(req.body).forEach((key) => {
      model.set(key, req.body[key]);
    });

    model = await model.forceUpdate(); // model.attribute = { name: "New Name", description: "Updated" }

    return res.json(model);
  } catch(e) {
    return res.json({
      errors: e
    });
  }
}
```

## Testing
Testing of the plugin is seamless as it uses the mocha.js testing framework with the chai.js TDD and BDD 
assertion library.

To test the plugin simply use the docker-compose file provided.

`docker-compose up -d`
Then execute the test suite using the following command

`docker-compose exec node npm test`