## JExcel Plugin : contextmenu_shortcut

ContextMenu_Shortcut is a plugin to improve the contextMenu of JExcel Pro. It allows you to change the base of shortcuts depending on whether you are on a Mac or a Windows. It also allows you to add icons for each menu item.

![Contextmenu_shortcut In JExcel Pro](https://i.ibb.co/2tzfMhJ/Jexcel-plugin-contextmenu-shortcut.png)

This plugin is **Free**

## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JExcel Pro](https://www.jexcel.net) 
- [Download JExcel CE](https://bossanova.uk/jexcel/)

## Documentation

### Dependencies

- [JExcel Pro v5](https://www.jexcel.net/v5) or [JExcel Pro v7](https://www.jexcel.net/v7)

- With default options of plugin, you should use [Material Design icons](https://material.io/resources/icons/). But, if you want, you can use fontawesome with editing all icons

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
			<td><code>icon_changeColumnType</code></td>
			<td>Icon for "Change column type"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;ballot&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewColumnBefore</code></td>
			<td>Icon for "Insert a new column before"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;add&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewColumnAfter</code></td>
			<td>Icon for "Insert a new column after"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;add&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_deleteSelectedColumns</code></td>
			<td>Icon for "Delete selected columns"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;delete&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_renameThisColumn</code></td>
			<td>Icon for "Rename this column"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;create&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_orderAscending</code></td>
			<td>Icon for "Order ascending"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;sort&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_orderDescending</code></td>
			<td>Icon for "Order descending"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;sort&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewRowBefore</code></td>
			<td>Icon for "Insert a new row before"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;add&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewRowAfter</code></td>
			<td>Icon for "Insert a new row after"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;add&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_deleteSelectedRows</code></td>
			<td>Icon for "Delete Selected Rows"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;delete&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_addComments</code></td>
			<td>Icon for "Add comment"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;insert_comment&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_clearComments</code></td>
			<td>Icon for "Clear comments"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;clear&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_cut</code></td>
			<td>Icon for "Cut"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;content_cut&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_copy</code></td>
			<td>Icon for "Copy"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;content_copy&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_paste</code></td>
			<td>Icon for "Paste"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;content_paste&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_saveAs</code></td>
			<td>Icon for "Save As"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;save&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>icon_about</code></td>
			<td>Icon for "About"</td>
			<td><code>String</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;info&lt;/i&gt;</code></td>
		</tr>
		<tr>
			<td><code>css</code></td>
			<td>CSS for icons</td>
			<td><code>String</code></td>
			<td><code>font-size:small; vertical-align:text-top; float:left; margin-left: -20px; margin-right: 2px;</code></td>
		</tr>
	</tbody>
</table>

### Get started

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">

<script src="/path/to/jexcel.contextmenu_shortcut.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'shortcut', plugin:jexcel_contextmenu_shortcut},
      ...  
    ],
    ...
});
```

#### Example with options

Use this way for defined icon of FontAwesome

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">

<script src="/path/to/jexcel.contextmenu_shortcut.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
        { name:'shortcut', plugin:jexcel_contextmenu_shortcut, options:{
        	icon_addComments: '<i class="context_icon material-icons">add</i>',
        }},
      ...  
    ],
    ...
});
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License