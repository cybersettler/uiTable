const d3 = require('d3');
const Handlebars = require('Handlebars');
const i18next = require('i18next');

function renderColumns(widget) {
    var headerTemplates = widget.view.querySelectorAll('th');
    var cellsWithHeaderData = widget.view.querySelectorAll('td[data-header]');
    var fromTemplate = false;

    if (headerTemplates.length > 0) {
        fromTemplate = true;
        widget.columns = generateColumnsFromContent(headerTemplates);
    }else if (cellsWithHeaderData.length > 0) {
        widget.columns = generateColumnsFromCells(widget, cellsWithHeaderData);
    } else if (widget.display || widget.schema) {
        widget.columns = generateColumnsFromConfig(widget);
    }

    var tableHeader = widget.view.shadowRoot.querySelector('thead');
    var headerRow = tableHeader.querySelector('tr');

    if (!headerRow) {
        headerRow = document.createElement("tr");
        tableHeader.appendChild(headerRow);
    }

    // Update…
    var th = d3.select(headerRow)
        .selectAll("th")
        .data(widget.columns);

    // Enter…
    th.enter().append("th")
        .call(appendHeader, widget, fromTemplate);

    // Exit…
    th.exit().remove();

    return widget;
}

function generateColumnsFromContent(widget, templates) {
    var i;
    var result = [];
    for (i = 0; i < templates.length ; i++) {
        addColumnTemplate(templates[i]);
    }
    return result;

    function addColumnTemplate(item){
        var column = {
            name: item.dataset.name,
            html: item.innerHTML,
            style: item.getAttribute('style')
        };
        if (widget.schema && item.name && widget.schema.properties[column.name]) {
            item.type = widget.schema.properties[column.name].type;
        }
        result.push(column);
    }
}

function generateColumnsFromCells(widget, cells) {
    var result = [];
    var i;
    for (i = 0 ; i < cells.length ; i++) {
        var itemModel = widget.model && widget.model[i] ? widget.model[i] : null;
        addColumnDefinition(cells[i], itemModel);
    }
    return result;

    /*
     * Header data may come from the schema
     */
    function addColumnDefinition(item, model) {
        var template = Handlebars.compile(item.dataset.header);
        var name = item.dataset.name;
        var type = widget.schema && widget.schema.properties[name].type ?
        widget.schema.properties[name].type : 'string';
        var column = {
            name: name,
            title: template({
                display: widget.display,
                schema: widget.schema,
                model: model
            }),
            type: type
        };
        result.push(column);
    }
}

function generateColumnsFromConfig(widget) {
    var result = [];
    var columns;
    if (widget.display && widget.display.columns) {
        columns = widget.display.columns;
    } else if (widget.schema && widget.schema.properties) {
        columns = Object.keys(widget.schema.properties);
    }
    columns.forEach(addColumnDefinition);
    return result;

    function addColumnDefinition(item) {
        var isString = typeof item === 'string';
        var column = {};

        if (isString && widget.schema && widget.schema.properties[item]) {
            column.name = item;
            column.title = i18next.t(widget.schema.properties[item].title);
            column.style = '';
        } else if (!isString && widget.display) {
            column = item;
            column.title = i18next.t(item.title);
        } else {
            column.name = item;
            column.title = item;
        }

        result.push(column);
    }
}

function appendHeader(selection, widget, fromTemplate) {
    if (fromTemplate) {
        selection.html(function(d) {
            var template = Handlebars.compile(d.html);
            return template({
                display: widget.display,
                schema: widget.schema,
                model: widget.model
            });
        });
    } else {
        selection.text(function(d) {
            return d.title;
        });
    }
}

module.exports = {
    renderColumns: renderColumns
};
