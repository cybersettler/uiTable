const d3 = require('d3');
const Handlebars = require('Handlebars');

function renderRows(widget) {
    var rowTemplate = widget.view.querySelector('tr[data-template=row]');
    var cells = widget.view.querySelectorAll('td');

    if (rowTemplate) {
        widget.rows = generateRowsFromTemplate(widget, cells);
    } else if(cells.length > 0) {
        widget.rows = generateRowsFromContent(widget, cells);
    } else {
        widget.renderCellsFromModel = true;
        widget.rows = generateRowsFromModel(widget);
    }

    var table = widget.view.shadowRoot.querySelector('table');

    // Update…
    var p = d3.select(table)
        .selectAll('tr[data-type=data]')
        .data(widget.rows);

    // Enter…
    p.enter().append('tr[data-type=data]');

    // Exit…
    p.exit().remove();

    return widget;
}

function generateRowsFromTemplate(widget, cells) {
    return widget.model.map(addRow);

    function addRow(item) {
        var row = {cells: []};
        var i;
        for (i = 0 ; i < cells.length ; i++) {
            row.cells.push(generateCell(cells[i], item));
        }
        return row;
    }

    function generateCell(cellTemplate, model) {
        widget.data[widget.view.dataset.model] = model;
        var template = Handlebars.compile(cellTemplate.innerHTML, widget.data);
        var cell = {
            html: template(),
            style: cellTemplate.getAttribute('style')
        };
        return cell;
    }
}

function generateRowsFromContent(widget) {
    var result = [];
    var rows = widget.view.querySelectorAll('tr');

    var i;
    for (i = 1 ; i < rows.length ; i++) {
        addRow(rows[i]);
    }

    return result;

    function addRow(item) {
        var row = { cells:[] };
        var cells = item.querySelectorAll('td');
        var j;
        for (j = 0 ; j < cells.length ; j++) {
            row.cells.push(generateCell(cells[j]));
        }
        result.push(row);
    }

    function generateCell(cellTemplate) {
        if (widget.model) {
            widget.data[widget.view.dataset.model] = widget.model[i];
        }
        var template = Handlebars.compile(cellTemplate.innerHTML, widget.data);
        var cell = {
            html: template(),
            style: cellTemplate.getAttribute('style')
        };
        return cell;
    }
}

function generateRowsFromModel(widget) {
    return widget.model.map(addRow);

    function addRow(model) {
        var row = {
            cells: widget.columns.map(addCell)
        };

        function addCell(column) {
            return model[column.name];
        }

        return row;
    }
}

module.exports = {
    renderRows: renderRows
};