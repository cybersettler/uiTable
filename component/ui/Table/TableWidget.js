const d3 = require('d3');
const Handlebars = require('Handlebars');
const i18next = require('i18next');
const ColumnService = require('./ColumnService.js');
const RowService = require('./RowService.js');
const CellService = require('./CellService.js');

function TableWidget(view, scope) {
  this.view = view;
  this.scope = scope;
  this.columns = [];
  this.rows = [];
  this.display = {};
  this.model = [];
  this.data = {};
  this.renderCellsFromModel = false;
}

TableWidget.prototype.render = function() {
  this.fetchData()
      .then(ColumnService.renderColumns)
      .then(RowService.renderRows)
      .then(CellService.renderCells);
};

TableWidget.prototype.fetchData = function() {
  var schema;
  var display;
  var promises = [];
  var widget = this;

  if (this.view.hasAttribute('data-model')) {
    promises.push(
        this.scope.getModel().then(function(result) {
          widget.model = result;
        })
    );
  }

  if (this.view.hasAttribute('data-schema')) {
    promises.push(
        this.scope.getSchema().then(function(result) {
          widget.schema = result;
          widget.data[widget.view.dataset.schema] = result;
        })
    );
  }

  if (this.view.hasAttribute('data-display')) {
    promises.push(
        this.scope.getDisplay().then(function(result) {
          widget.display = result;
          widget.data[widget.view.dataset.display] = result;
        })
    );
  }

  return Promise.all(promises).then(function() {
    return widget;
  });
};

module.exports = TableWidget;
