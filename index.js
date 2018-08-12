/* eslint-disable */

module.exports = (Bookshelf) => {
  // Create a reference to the Model prototype
  const ModelPrototype = Bookshelf.Model.prototype;
  Bookshelf.Model = Bookshelf.Model.extend({
    /**
     * @name constructor
     * The constructor function for bookshelf.
     * @returns void
     */
    constructor() {
      // Call the constructor on the prototype chain so as to not get rid of anything that other plugins may do.
      ModelPrototype.constructor.call(this, arguments);
      // Create the enable_protected_columns boolean so we can override it for a force update.
      this.enable_protected_columns = true;
      // If the protected_columns property exists and is an array
      if (this.protected_columns && (this.protected_columns instanceof Array)) {
        // Then register a function to the updating event
        this.on('updating', this.protect_columns);
      }
    },
    /**
     * @name forceUpdate
     * This will method will disable the protection of columns temporarily to allow for
     * updates to be `force` pushed.
     * @param {String|Object} key The key we wish to update, may also be an object.
     * @param {String|Object} val The value we wish to set the key to, may be options if an object is passed for the first argument.
     * @param {Object} options The options we want to pass to save()
     * @returns this
     *
     */
    async forceUpdate(key, val, options) {
      try {
        this.enable_protected_columns = false;
        // Save the model
        await ModelPrototype.save.call(this, key, val, options);
        this.enable_protected_columns = true;

        return this;
      } catch(e) {
        // Catching only to throw again to it can be caught further down the line?
        throw Error(e);
      }
    },
    /**
     * @name protect_columns
     * A function that will be used as our callback for the updating event.
     * @param {Model} model The model object
     * @param {Object} attributes An object containing the attributes that will be updated
     * @param {Object} options An object containing the options for the update?
     * @returns void
     *
     */
    protect_columns(model, attributes, options) {
      // Use a for loop to iterate over each item of the array,
      if(this.enable_protected_columns) {
        for (let i = 0; i < this.protected_columns.length; i++) {
          // Set the model to use the _previousAttributes value for the protected column
          this.set(this.protected_columns[i], model._previousAttributes[this.protected_columns[i]]);
        }
      }
    },
  });
};

/* eslint-enable */
