const d3 = require('d3');

function renderCells(widget) {
    var table = widget.view.shadowRoot.querySelector('table');

    // Update…
    var td = d3.select(table)
        .selectAll('tr[data-type=data]')
        .data(widget.rows)
        .selectAll('td')
        .datum(function(d) {
            return d.cells;
        });

    // Enter…
    td.enter().append('td').call(addCellContent, widget);

    // Exit…
    td.exit().remove();
}

function addCellContent(selection, widget) {
    if (widget.renderCellsFromModel) {
        return selection.text(function(d) {
            return d;
        });
    }
    selection.attr('style', function(d) {
        return d.style;
    }).html(function(d) {
        return d.html;
    });
}

module.exports = {
    renderCells: renderCells
};