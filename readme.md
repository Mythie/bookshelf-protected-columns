# Bookshelf Protected Columns
This bookshelf plugin allows a user to specify which columns they wish to be immutable or protected,
the plugin reads these columns from the Model's `protected_columns` property which is set to undefined by
default. In order to achieve this we register an event to the Models updating event that tells it to set the 
currnt attribute back to it's previous attribute if it's within the protected_columns array.

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
const crypto = require('crypto');

const bookshelf = require('../bookshelf');
const Ticket = require('./ticket');

const Event = bookshelf.Model.extend({
  tableName: 'table_name',
  hasTimestamps: true,
  protected_columns: ['name', 'created_at'],
});

module.exports = bookshelf.model('Event', Event);

```