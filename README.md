# UI Table

> Table component for _websemble_ application.

__Features__:
* JSON schema support
* Dynamic rendering from data
* Bootstrap table styling

## Getting started

Include UI Table in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiTable": "cybersettler/uiTable"
  }
}
```

In your view you would insert an HTML tag like so:

```html
<ui-table>
  ...
</ui-table>
```

## Displaying columns

There are three different ways to determine which columns to
display and how. Either they are determined from a JSON schema,
and/or they are determined form a display configuration object,
or they are specified in the view.

To specify a schema, on your view include the UI table like so:

```html
<ui-table data-schema="/contacts/schema">
  ...
</ui-table>
```

With only the schema, there is no way to guaranty the order in
which the columns will be displayed, since the schema properties
is a Javascript object.

To overcome this you may specify the order in a display configuration
object, like so:

```html
<ui-table
  data-schema="/contacts/schema"
  data-display="display">
  ...
</ui-table>
```

```javascript
// Controller.js
// ...
this.getDisplay = function() {
    return {
      style: 'default',
      columns: ['lastName', 'firstName', 'birthday']
    };
  };
// ...
```

Also you could specify the order by HTML content, like so:

```html
<ui-table
  data-schema="/contacts/schema">
  <tr>
    <th data-name="lastName">{{i18n 'contacts.lastName'}}</th>
    <th data-name="firstName">{{i18n 'contacts.firstName'}}</th>
    <th data-name="birthday">{{i18n 'contacts.birthday'}}</th>
  </tr>
  ...
</ui-table>
```

Another way to display data is by an html template display:

```html
<ui-table data-model="/contacts">
    <tr data-template="row">
        <td data-header="{{i18n 'contact.lastname'}}">
            {{model.lastname}}
        </td>
        <td data-header="{{i18n 'contact.firstname'}}">
            {{model.firstname}}
        </td>
    </tr>
</ui-table>
```
## API

### data-model

List of items to display in the table.

### data-schema

Data structure of the model item.

### data-display

Display configuration of the table. The display object supports the following options:

* __styleClass__ (enum: default | striped | bordered | hover | condensed ): defines the table style.
* __columns__ (array): Determines the columns to display and the order.
The items may be strings or objects. The string value must match
the name of a specified schema property.
  - __name__ (string): Name of the property.
  - __title__ (string): Text to display as column title.
  - __cellTemplate__ (string): HTML string to use as template.
* __row__ (object): Row configuration.
  - __id__ (string): Field to use as id of the row.
