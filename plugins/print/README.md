## JExcel Plugin : Print

The print plugin add lot of features for print sheet.

![preview](https://user-images.githubusercontent.com/52194475/91539002-f2c97f80-e918-11ea-9bd8-8ec33d4f0c92.png)

This plugin is **Premium** Contact me if you are interested to buy : [contact@gbonnaire.fr](mailto://contact@gbonnaire.fr)

### Features

- Add icon on toolbar
- Print all cells of sheet (page break with lot of rows)
- Print area defined, print selection or print result search
- Orientation of page
- Zoom
- Apply Style of Cell for print (i.e. print CSS of conditional style)
- Popup print
- Replace checkbox by string Yes / No
- You can translate plugin


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
			<td><code>allowPrint</code></td>
			<td>Allow print for page</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>allowShortcut</code></td>
			<td>Allow shortcut CTRL+P for open popup of print</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>autoprint</code></td>
			<td>start print automaticaly after preview. Set false for force preview before print</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>header</code></td>
			<td>Show columns header on print</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>index</code></td>
			<td>Show rows index on print</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>orientation</code></td>
			<td>Defined orientation of page<br>
				<ul>
					<li>auto : page orientation defined by printer</li>
					<li>landscape : page orientation force to landscape</li>
					<li>portrait : page orientation force to portrait</li>
				</ul></td>
			<td><code>String</code></td>
			<td><code>auto</code></td>
		</tr>
		<tr>
			<td><code>range</code></td>
			<td>Defined area range</td>
			<td><code>ArrayOfCoord[x1,y1,x2,y2] or String "A1:B5"</code></td>
			<td><code>null</code></td>
		</tr>
		<tr>
			<td><code>style</code></td>
			<td>Defined styles CSS</td>
			<td><code>String|Function</code></td>
			<td><code>(blank)</code></td>
		</tr>
		<tr>
			<td><code>stylesheet</code></td>
			<td>Defined url of style file .css</td>
			<td><code>String</code></td>
			<td><code>(blank)</code></td>
		</tr>
		<tr>
			<td><code>title</code></td>
			<td>Title of page printed</td>
			<td><code>String</code></td>
			<td><code>(blank)</code></td>
		</tr>
		<tr>
			<td><code>zoom</code></td>
			<td>Zoom of page printed (1 = 100%)</td>
			<td><code>Float</code></td>
			<td><code>1</code></td>
		</tr>
	</tbody>
</table>

For translation
<table>
	<thead>
		<tr>
			<th>Option name</th>
			<th>Default Value</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>text_true</code></td>
			<td>Yes</td>
		</tr>
		<tr>
			<td><code>text_false</code></td>
			<td>No</td>
		</tr>
		<tr>
			<td><code>text_orientation</code></td>
			<td>Orientation</td>
		</tr>
		<tr>
			<td><code>text_orientation_landscape</code></td>
			<td>Landscape</td>
		</tr>
		<tr>
			<td><code>text_orientation_portrait</code></td>
			<td>Portrait</td>
		</tr>
		<tr>
			<td><code>text_orientation_auto</code></td>
			<td>Printer settings</td>
		</tr>
		<tr>
			<td><code>text_zoom</code></td>
			<td>Zoom</td>
		</tr>
		<tr>
			<td><code>text_title</code></td>
			<td>Title of page</td>
		</tr>
		<tr>
			<td><code>text_popup_title</code></td>
			<td>Print options</td>
		</tr>
		<tr>
			<td><code>text_index</code></td>
			<td>Show index of rows</td>
		</tr>
		<tr>
			<td><code>text_header</code></td>
			<td>Show header of columns</td>
		</tr>
		<tr>
			<td><code>text_print_area</code></td>
			<td>Print area</td>
		</tr>
		<tr>
			<td><code>text_print_selection</code></td>
			<td>Print selection</td>
		</tr>
		<tr>
			<td><code>text_print_resultsearch</code></td>
			<td>Print results of search</td>
		</tr>
		<tr>
			<td><code>text_print_all</code></td>
			<td>Print all rows of the sheet</td>
		</tr>
		<tr>
			<td><code>text_print_area_defined</code></td>
			<td>Print area defined</td>
		</tr>
		<tr>
			<td><code>text_print</code></td>
			<td>Print</td>
		</tr>
		<tr>
			<td><code>text_printpreview</code></td>
			<td>Preview</td>
		</tr>
	</tbody>
</table>


### Methods of plugin

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Description</th>
			<th>Example</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>do(*optional* Object optionsPrint) → Void</code></td>
			<td>execute print with options, if optionsPrint is null, print with default options</td>
			<td><code>jexcel.current.plugins.print.do({title:'test button print', index:false});</code></td>
		</tr>
		<tr>
			<td><code>open() → Void</code></td>
			<td>Open popup print</td>
			<td><code>jexcel.current.plugins.print.open();</code></td>
		</tr>
		<tr>
			<td><code>preview(*optional* Object optionsPrint) → Void</code></td>
			<td>execute preview print with options, if optionsPrint is null, preview with default options</td>
			<td><code>jexcel.current.plugins.print.preview({title:'test button print', index:false});</code></td>
		</tr>
		<tr>
			<td><code>resetRange() → Void</code></td>
			<td>remove range print area</td>
			<td><code>jexcel.current.plugins.print.resetRange();</code></td>
		</tr>
		<tr>
			<td><code>setRange(Array|String range) → Void</code></td>
			<td>set range print area (by Coord [x1,y1,x2,y2] of A1:B10)</td>
			<td><code>jexcel.current.plugins.print.setRange("A1:B10");</code></td>
		</tr>
		<tr>
			<td><code>setStyle(String style) → Void</code></td>
			<td>set style of page printed</td>
			<td><code>jexcel.current.plugins.print.setStyle(".jexcel tbody tr td.cellAlert {background-color: #f46e42!important;color: #ffffff;}");</code></td>
		</tr>
	</tbody>
</table>


## Get started
Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.print.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'print', plugin:jexcel_print},
      ...  
    ],
    ...
});
```
## Example
Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.print.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
   		 { name:'print', plugin:jexcel_print, options:{title:"test print", index:false, style:function(obj) { return obj.plugins.conditionalstyle.getCSS(); }} }, // For apply style of plugin conditional style
      ...  
    ],
    ...
});
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License