const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const i18next = require('i18next');
const Handlebars = require('Handlebars');
var expect = require('chai').expect;
var TableWidget = require("../../../../component/ui/Table/TableWidget.js");
var view;
var model;
var schema;
var display;
var scope = {
    getModel: function () {
        return Promise.resolve(model);
    },
    getSchema: function () {
        return Promise.resolve(schema);
    },
    getDisplay: function () {
        return Promise.resolve(display);
    }
};

describe('TableWidget', function () {
    describe('#render()', function () {
        before(function (done) {
            document = (new JSDOM('<!DOCTYPE html><html><bod></body></html>')).window.document;
            i18next.init({
                lng: 'en',
                resources: {
                    en: {
                        translation: {
                            contact: {
                                firstname: 'First name',
                                lastname: 'Last name',
                                gender: 'Gender'
                            }
                        }
                    }
                }
            }, (err, t) => {
                Handlebars.registerHelper('i18n', function(key, opt) {
                    return t(key, opt);
                });
                done(err);
            });
        });
        beforeEach(function () {
            model = null;
            schema = null;
            display = null;
        });
        it('should generate table from schema', function (done) {
            givenModel();
            givenSchema();
            givenEmptyView();
            var modelValue = "/contact";
            var schemaValue = "/contact/schema";
            view.setAttribute('data-model', modelValue);
            view.setAttribute('data-schema', schemaValue);
            view.dataset.model = modelValue;
            view.dataset.schema = schemaValue;
            var widget = new TableWidget(view, scope);
            widget.render().then(function () {
                // console.log("content:", view.shadowRoot.innerHTML);
                var table = view.shadowRoot.querySelector('table');
                var columns = table.querySelectorAll('th');
                var cells = table.querySelectorAll('td');
                var rows = table.querySelectorAll('tr');
                expect(rows.length).to.equal(3);
                expect(columns.length).to.equal(6);
                expect(cells.length).to.equal(12);
                done();
            }).catch(done);
        });
        it('should generate table from display', function (done) {
            givenModel();
            givenDisplay({columns:['lastname','firstname',{
                name: 'gender',
                title: 'contact.gender'
            }]});
            givenEmptyView();
            var modelValue = "/contact";
            var displayValue = "display";
            view.setAttribute('data-model', modelValue);
            view.setAttribute('data-display', displayValue);
            view.dataset.model = modelValue;
            view.dataset.display = displayValue;
            var widget = new TableWidget(view, scope);
            widget.render().then(function () {
                // console.log("content:", view.shadowRoot.innerHTML);
                var table = view.shadowRoot.querySelector('table');
                var columns = table.querySelectorAll('th');
                var rows = table.querySelectorAll('tr');
                expect(rows.length).to.equal(3);
                expect(columns.length).to.equal(3);
                expect(columns[0].textContent).to.equal('lastname');
                expect(columns[1].textContent).to.equal('firstname');
                expect(columns[2].textContent).to.equal('Gender');
                var row1Cells = rows[1].querySelectorAll('td');
                expect(row1Cells.length).to.equal(3);
                expect(row1Cells[0].textContent).to.equal('Wayne');
                expect(row1Cells[1].textContent).to.equal('Bruce');
                expect(row1Cells[2].textContent).to.equal('male');
                var row2Cells = rows[2].querySelectorAll('td');
                expect(row2Cells.length).to.equal(3);
                expect(row2Cells[0].textContent).to.equal('Parker');
                expect(row2Cells[1].textContent).to.equal('Peter');
                expect(row2Cells[2].textContent).to.equal('male');
                done();
            }).catch(done);
        });
        it('should generate table from row template', function (done) {
            givenModel();
            givenSchema();
            givenRowTemplateView();
            var modelValue = "/contact";
            var displayValue = "display";
            view.setAttribute('data-model', modelValue);
            view.setAttribute('data-display', displayValue);
            view.dataset.model = modelValue;
            view.dataset.display = displayValue;
            var widget = new TableWidget(view, scope);
            widget.render().then(function () {
                // console.log("content:", view.shadowRoot.innerHTML);
                var table = view.shadowRoot.querySelector('table');
                var columns = table.querySelectorAll('th');
                var cells = table.querySelectorAll('td');
                expect(columns.length).to.equal(3);
                expect(cells.length).to.equal(6);
                expect(columns[0].textContent).to.equal('Last name');
                expect(columns[1].textContent).to.equal('First name');
                expect(columns[2].textContent).to.equal('Gender');
                expect(cells[0].textContent).to.equal('Wayne');
                expect(cells[1].textContent).to.equal('Bruce');
                expect(cells[2].textContent).to.equal('male');
                done();
            }).catch(done);
        });
    });
});

function givenModel() {
    model = [{
        firstname: 'Bruce',
        lastname: 'Wayne',
        gender: 'male',
        description: 'The Batman',
        agreement: true
    },{
        firstname: 'Peter',
        lastname: 'Parker',
        gender: 'male',
        description: 'Spiderman',
        agreement: true
    }];
}

function givenSchema() {
    schema = {
        "title": "Example Schema",
        "type": "object",
        "properties": {
            "gender": {
                "type": "string",
                "enum": ["male", "female"]
            },
            "firstname": {
                "title": "First Name",
                "type": "string"
            },
            "lastname": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "birthdate": {
                "title": "Birthday",
                "type": "string",
                "pattern": "^\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d$"
            },
            "agreement": {
                "type": "boolean",
                "description": "I agree"
            }
        },
        "required": ["firstname", "lastname"]
    };
}

function givenDisplay(data) {
    display = data;
}

function givenEmptyView() {
    view = document.createElement('div');
    var container = document.createElement('div');
    container.classList.add('table-responsive');
    var table = document.createElement('table');
    var tableHead = document.createElement('thead');
    var tableBody = document.createElement('tbody');
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    container.appendChild(table);
    view.shadowRoot = createShadowRoot();
    view.shadowRoot.appendChild(container);
    view.dataset = {};
}

function givenRowTemplateView() {
    givenEmptyView();
    var tr = document.createElement('tr');
    tr.setAttribute('data-template', 'row');
    tr.dataset = {
      template: 'row'
    };

    appendCell(tr, 'lastname');
    appendCell(tr, 'firstname');
    appendCell(tr, 'gender');
    view.appendChild(tr);
}

function appendCell(tr, attribute) {
  var header = "{{i18n 'contact." + attribute + "'}}";
  var td = document.createElement('td');
  td.setAttribute('data-header', header);
  td.dataset = {
    header: header
  };
  td.textContent = '{{model.' + attribute + '}}';
  tr.appendChild(td);
}

function givenFilledView() {
    givenEmptyView();
    var content = [];
    console.log('template', content.join('\n'));
}

function createShadowRoot() {
    return document.createElement('div');
}
