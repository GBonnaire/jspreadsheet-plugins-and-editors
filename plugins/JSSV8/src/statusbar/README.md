## jSpreadsheet Plugin : Status bar

 Status bar is a plugin for add a status bar on bottom of the sheet like Excel. On this status bar you can add new row with button, and show information on selection (Range selected, Formulas, etc.)

![preview](https://user-images.githubusercontent.com/52194475/212060949-f1c1b9ef-85ff-4070-96e5-83ba29dee0b3.png)


This plugin is **Free**

## What is jSpreadsheet ?

jSpreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8)
  or
- [jSpreadsheet Pro v9](https://www.jspreadsheet.com/v9)

- [formula-pro](https://jspreadsheet.com/products/formulas)

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
			<td><code>showAddRowButton</code></td>
			<td>For show or hide add row button on left of status bar<br>
			Values availables : <br>
			 - <code>true</code> for all,<br>
			 - <code>false</code> none,<br>
			 - <code>"before"</code> for only add before row,<br>
			 - <code>"after"</code> for only add after row
			 </td>
			<td><code>Boolean or String</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>showAddColButton</code></td>
			<td>For show or hide add col button on left of status bar
			Values availables : <br>
			 - <code>true</code> for all,<br>
			 - <code>false</code> none,<br>
			 - <code>"before"</code> for only add before column,<br>
			 - <code>"after"</code> for only add after column
			</td>
			<td><code>Boolean or String</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>defaultQuantity</code></td>
			<td>Define defautlQuantity on input</td>
			<td><code>Integer</code></td>
			<td><code>10</code></td>
		</tr>
		<tr>
			<td><code>closeInsertionOnly</code></td>
			<td>option to defined behavior insertion method</td>
			<td><code>Boolean</code></td>
			<td><code>false</code></td>
		</tr>
		<tr>
			<td><code>autoButtonDisable</code></td>
			<td>option to defined behavior action bar. Automatic button disable when no action it's possible</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>formulas</code></td>
			<td>Object of formulas, you can use quick reference on formulas<br>
      <code>{range}</code> : Range name A1:B3<br>
      <code>{cells}</code> : Array of cells (work with filtered row) [A1,A3,B1,B3]<br>
      <code>{x1}</code> : x start selection (first x = 0)<br>
      <code>{y1}</code> : y start selection (first y = 0)<br>
      <code>{x2}</code> : x end selection<br>
      <code>{y2}</code> : y end selection<br>
      the key property of object is the name showing before result<br>If you use custom formula, for not show empty result, return null.
      </td>
			<td><code>Object</code></td>
			<td><code>{
"Range":"{range}", // Format A1:B5
"SUM":"=SUM({range})",
"MAX":"=MAX({range})",
"MIN":"=MIN({range})"
},</code></td>
		</tr>
	</tbody>
</table>

You can modify CSS file for change separator of formulas

### Events
This plugin dispatch this events
<table>
	<thead>
		<tr>
			<th>Event name</th>
			<th>Args</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>statusbar_onload</code></td>
			<td>WorkBook, Elements(Array of elements)</td>
		</tr>
		<tr>
			<td><code>statusbar_buttons_disable</code></td>
			<td>Worksheet, Elements(Array of elements)</td>
		</tr>
		<tr>
			<td><code>statusbar_buttons_enable</code></td>
			<td>Worksheet, Elements(Array of elements)</td>
		</tr>
	</tbody>
</table>

### For translation
you can use jSuites dictionary for translate this plugin
<table>
	<thead>
		<tr>
			<th>Option name</th>
			<th>Default Value</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>label</code></td>
			<td>Add</td>
		</tr>
	</tbody>
</table>


### Get started

Header on page
```HTML
<script src="https://jspreadsheet.com/v8/jspreadsheet.js"></script>
<script src="https://jsuites.net/v4/jsuites.js"></script>
<link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jspreadsheet.com/v8/jspreadsheet.css" type="text/css" />

<script src="/path/to/statusbar.min.js"></script>
<link rel="stylesheet" href="/path/to/statusbar.min.css" type="text/css" />
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'statusBar', plugin:jss_statusbar },
      ...  
    ],
    ...
});
```

#### Example with options with Options

Header on page
```HTML
<script src="https://jspreadsheet.com/v8/jspreadsheet.js"></script>
<script src="https://jsuites.net/v4/jsuites.js"></script>
<link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jspreadsheet.com/v8/jspreadsheet.css" type="text/css" />

<script src="/path/to/statusbar.min.js"></script>
<link rel="stylesheet" href="/path/to/statusbar.min.css" type="text/css" />
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'statusBar', plugin:jss_statusbar, options: { 
                 showAddRowButton: false, 
                 formulas:{
                    "COUNT":"=COUNT({range})",
                 } // End formulas
            } // End options
      },
      ...  
    ],
    ...
});
```

## CDN

You can use this CDN link
```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/statusbar.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/statusbar.min.css" type="text/css" />
```

## NPM
npm install @jspreadsheet/statusbar
```javascript
import jss_statusBar from '@jspreadsheet/statusbar';
import '@jspreadsheet/statusbar/style.css';
```

Example for webpack
```javascript
import 'material-icons/iconfont/material-icons.css';
import jSuites from 'jsuites';
import 'jsuites/dist/jsuites.css';
import jspreadsheet from 'jspreadsheet';
import 'jspreadsheet/dist/jspreadsheet.css';
import formula from '@jspreadsheet/formula-pro';
import jss_statusbar from '@jspreadsheet/statusbar';
import '@jspreadsheet/statusbar/style.css';

jspreadsheet.setLicense("YourLicensekey");

jspreadsheet.setExtensions( { formula } );

const myTable = jspreadsheet(document.getElementById('myTable'), {
        minDimensions: [50, 50],
        toolbar: true,
        plugins: [{name: 'status', plugin: jss_statusbar, options: {}}],
});

```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
