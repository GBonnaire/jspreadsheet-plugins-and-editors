## JExcel Plugin : Status bar

 Status bar is a plugin for add a status bar on bottom of the sheet like Excel. On this status bar you can add new row with button, and show information on selection (Range selected, Formulas, etc.)

![preview](https://user-images.githubusercontent.com/52194475/94404123-c484cd00-016e-11eb-8f27-c978019f181e.png)


This plugin is **Free**

## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JExcel Pro](https://www.jexcel.net) 
- [Download JExcel CE](https://bossanova.uk/jexcel/)

## Documentation

### Dependencies

- [JExcel Pro v5](https://www.jexcel.net/v5) or [JExcel Pro v7](https://www.jexcel.net/v7)  

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
			<td>For show or hide add row button on left of status bar</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>formulas</code></td>
			<td>Object of formulas, you can use quick reference on formulas<br>
      <code>{range}</code> : Range name A1:B3<br>
      <code>{x1}</code> : x start selection (first x = 0)<br>
      <code>{y1}</code> : y start selection (first y = 0)<br>
      <code>{x2}</code> : x end selection<br>
      <code>{y2}</code> : y end selection<br>
      the key property of object is the name showing before result
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

### Get started

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.statusbar.js"></script>
<link rel="stylesheet" href="/path/to/jexcel.statusbar.css" type="text/css" />
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'statusBar', plugin:jexcel_statusbar },
      ...  
    ],
    ...
});
```

#### Example with options with Options

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.statusbar.js"></script>
<link rel="stylesheet" href="/path/to/jexcel.statusbar.css" type="text/css" />
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'statusBar', plugin:jexcel_statusbar, options: { 
                 showAddRowButton: false, 
                 formulas:{
                    "COUNT":"=COUNT({range})",
                 }
      },
      ...  
    ],
    ...
});
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
