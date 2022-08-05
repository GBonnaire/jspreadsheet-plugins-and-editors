## jspreadsheet Plugin : auto Width

The autoWidth plugin add possibility to set auto width of columns.

This plugin is **Free**


### Features

- Auto width columns without width property or property:"auto" on initialization
- the min width is equiv to defaultColWidth
- can setWidth with "auto" value


## What is jSpreadsheet ?

jspreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8) 
-   or
- [jSpreadsheet Pro v9](https://www.jspreadsheet.com/v9)

if you have a lot a plugins, add on the top autoWidth

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
			<td><code>fullsizeTable</code></td>
			<td>Calculate size column auto to use fullsize of screen</td>
			<td><code>Boolean</code></td>
			<td><code>false</code></td>
		</tr>
		<tr>
			<td><code>parseAllData</code></td>
			<td>Calculate size column auto with all data of columns (not only data showed)</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
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

<script src="/path/to/autoWidth.min.js"></script>
```

Initialize plugin on jspreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'autoWidth', plugin:jss_autoWidth},
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/autoWidth.min.js"></script>
```

## NPM
npm install @jspreadsheet/autowidth
```javascript
import jss_autoWidth from '@jspreadsheet/autowidth';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
