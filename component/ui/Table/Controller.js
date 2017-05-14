const TableWidget = require('./TableWidget.js');

/**
* Controller of the table widget
* @constructor
* @param {object} view - HTML element.
* @param {object} scope - Context of the web component.
*/
function TableController(view, scope) {
  this.super(view, scope);
  var controller = this;

  scope.onAttached.then(function() {
    var bindingAttributes = [];

    if (view.hasAttribute('data-model')) {
      bindingAttributes.push('model');
    }

    if (view.hasAttribute('data-schema')) {
      bindingAttributes.push('schema');
    }

    if (view.hasAttribute('data-display')) {
      bindingAttributes.push('display');
    }
    scope.bindAttributes(bindingAttributes);
    controller.tableWidget = new TableWidget(view, scope);
    controller.tableWidget.render();
  });

  this.render = function() {
    this.tableWidget.render();
  };
}

module.exports = TableController;
