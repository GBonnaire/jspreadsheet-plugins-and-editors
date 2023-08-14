## jSpreadsheet Plugin : sync Input

The syncInput plugin sync data of jSpreadsheet in Input hidden.

This plugin is **Free**


### Features

- Sync data in input hidden


## What is jSpreadsheet ?

jSpreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JSpreadsheet](https://www.jspreadsheet.com)

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8)
  or
- [jSpreadsheet Pro v9](https://www.jspreadsheet.com/v9)
- or
- [jSpreadsheet Pro v10](https://www.jspreadsheet.com/v10)


### Options of plugin

<table>
	<thead>
		<tr>
			<th>Option name</th>
			<th>Description</th>
			<th>Type</th>
			<th>Default Value</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>checkRow</code></td>
			<td>Function for checkRow before add in sync value </td>
			<td><code>Function (row data, instance of jSpreadsheet, index rows) &rarr; should return true or false</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>fieldsRequired</code></td>
			<td>Array of index columns or name columns who are not empty</td>
			<td><code>Array</code></td>
			<td><code>[]</code></td>
		</tr>
		<tr>
			<td><code>inputElement</code></td>
			<td>DOMElement of input</td>
			<td><code>DOMElement</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>inputId</code></td>
			<td>Id of Element, if element not exist, plugin create input with id=inputId and name=inputId, id inputId is null by default input is jSpreadsheet_DATA</td>
			<td><code>String</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>processedValues</code></td>
			<td>get processed value (replace formula by value)</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>worksheetId</code></td>
			<td>synchronize specifics worksheet identify with worksheetId, by default it's first worksheet loaded</td>
			<td><code>String or Array of Id</code></td>
			<td><code>null</code></td>
		</tr>
	</tbody>
</table>

if you have a lot a plugins, add on the top autoWidth
### Get started

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/syncInput.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'syncInput', plugin:jss_syncInput, options:{inputId:'IdMyInput'} },
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/syncInput.min.js"></script>
```

## NPM
npm install @jspreadsheet/syncinput
```javascript
import jss_syncInput from '@jspreadsheet/syncinput';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
