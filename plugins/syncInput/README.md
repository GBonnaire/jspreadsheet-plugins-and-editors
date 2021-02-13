## JExcel Plugin : sync Input

The syncInput plugin sync data of Jexcel in Input hidden.

This plugin is **Free**


### Features

- Sync data in input hidden


## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JExcel Pro](https://www.jexcel.net) 
- [Download JSpreadsheet](https://www.jspreadsheet.com)

## Documentation

### Dependencies

- [JExcel Pro v7](https://www.jexcel.net/v7) 

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
			<td><code>Function (row data, instance of jexcel, index rows) &rarr; shoudl return true or false</code></td>
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
			<td>Id of Element, if element not exist, plugin create input with id=inputId and name=inputId, id inputId is null by default input is JEXCEL_DATA</td>
			<td><code>String</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>processedValues</code></td>
			<td>get processed value (replace formula by value)</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
	</tbody>
</table>

if you have a lot a plugins, add on the top autoWidth
### Get started

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.inputSync.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'inputSync', plugin:jss_inputSync, options:{inputId:'IdMyInput'} },
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/Guillaume-Bo/jexcel-plugins-and-editors@latest/plugins/inputSync/jexcel.inputSync.js"></script>
```

## NPM
Coming soon (March 2021)
```javascript
import download from '@jspreadsheet/inputSync';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
