## jSpreadsheet Plugin : Row Header rename

 Row Header rename is a plugin for rename row header (Index) with custom name

![preview](https://user-images.githubusercontent.com/52194475/91864087-220d2300-ec70-11ea-9390-fe52e74cf28e.png)


This plugin is **Free**

## What is jSpreadsheet ?

jSpreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8)  
- or
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
			<td><code>headerIndexTitle</code></td>
			<td>For change header text of column index</td>
			<td><code>String</code></td>
			<td>(blank)</td>
		</tr>
		<tr>
			<td><code>rowIndexTitle</code></td>
			<td>For change header row (Index)<br>
      If set an array : value repeat after last name set
      If set a function : ryou have 1 parameter : index, return string,
      If set an object : property = indexrow, value of property = value
      </td>
			<td><code>String|Array[value, value]|Object {indexrow:value,...}|function (indexRow) {}</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>widthRowIndex</code></td>
			<td>For resize column index</td>
			<td><code>Int|String</code></td>
			<td><code>50</code></td>
		</tr>
	</tbody>
</table>

### Use in specifics worksheet

For use this plugin on specifics worksheet, set in option in worksheet the role `headerRename`

```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	worksheets:[{
		...
		role: ["headerRename"],
		...
	},{
		...
		role: "headerRename",
		...
	}],
	...
	plugins: [
      ...
      { name:'rowRename', plugin:jss_rowHeaderRename, options:{headerIndexTitle: "hours", rowIndexTitle:function(rowIndex) {return (rowIndex % 24) + ":00";}}},
      ...  
    ],
    ...
});
```


### Get started

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/rowHeaderRename.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'rowRename', plugin:jss_rowHeaderRename, options:{headerIndexTitle: "hours", rowIndexTitle:function(rowIndex) {return (rowIndex % 24) + ":00";}}},
      ...  
    ],
    ...
});
```

#### Example with options with Array

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/rowHeaderRename.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'rowRename', plugin:jss_rowHeaderRename, options:{headerIndexTitle: "Who ?", rowIndexTitle:["Me", "You", "Us"]}},
      ...  
    ],
    ...
});
```

#### Example with options with Object

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/rowHeaderRename.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'rowRename', plugin:jss_rowHeaderRename, options:{headerIndexTitle: "Name", rowIndexTitle:{0:"Tom", 1:"Pierre", 2:"Jean", 3:"William"}, widthRowIndex: 100}},
      ...  
    ],
    ...
});
```

## CDN

You can use this CDN link
```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/rowHeaderRename.min.js"></script>
```

## NPM
npm install @jspreadsheet/rowheaderrename
```javascript
import jss_rowHeaderRename from '@jspreadsheet/rowheaderrename';
```



## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
