## jSpreadsheet Plugin : Contextmenu rows advanced actions

ContextMenu rows advanced actions is a plugin for add new items in contextMenu of jSpreadsheet Pro for manage rows. 

![preview](https://user-images.githubusercontent.com/52194475/102090914-5b802d80-3e1e-11eb-9fe6-572cea5eecae.png)

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

- With default options of plugin, you should use [Material Design icons](https://material.io/resources/icons/). 

```HTML
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
 ```   

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
			<td><code>icon_moveup</code></td>
			<td>Icon for "move up rows"</td>
			<td><code>String</code></td>
			<td><code>arrow_upward</code></td>
		</tr>
		<tr>
			<td><code>icon_movedown</code></td>
			<td>Icon for "Move down rows"</td>
			<td><code>String</code></td>
			<td><code>arrow_downward</code></td>
		</tr>
		<tr>
			<td><code>icon_duplicate</code></td>
			<td>Icon for "Duplicate rows"</td>
			<td><code>String</code></td>
			<td><code>content_copy</code></td>
		</tr>
		<tr>
			<td><code>icon_deleteSelectedColumns</code></td>
			<td>Icon for "Delete selected columns"</td>
			<td><code>String</code></td>
			<td><code>delete</code></td>
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
			<td><code>text_moveup</code></td>
			<td><code>Move up row(s) selected</code></td>
		</tr>
		<tr>
			<td><code>text_movedown</code></td>
			<td><code>Move down row(s) selected</code></td>
		</tr>
		<tr>
			<td><code>text_duplicate</code></td>
			<td><code>Duplicate row(s) selected</code></td>
		</tr>
	</tbody>
</table>

### Get started

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">

<script src="/path/to/contextmenu_rowAdvancedActions.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'rowsAdvancedAction', plugin:jss_contextmenu_rowAdvancedActions},
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/adist/contextmenu_rowsAdvancedActions.min.js"></script>
```

## NPM
npm install @jspreadsheet/contextmenu_rowsadvancedactions
```javascript
import jss_contextmenu_rowAdvancedActions from '@jspreadsheet/contextmenu_rowsadvancedactions';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
