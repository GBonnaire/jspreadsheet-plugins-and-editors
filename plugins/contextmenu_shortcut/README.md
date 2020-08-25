## JExcel Plugin : contextmenu_shortcut

ContextMenu_Shortcut is a plugin to improve the contextMenu of JExcel Pro. It allows you to change the base of shortcuts depending on whether you are on a Mac or a Windows. It also allows you to add icons for each menu item.

![Contextmenu_shortcut In JExcel Pro](https://i.ibb.co/2tzfMhJ/Jexcel-plugin-contextmenu-shortcut.png)

This plugin is **Free**

## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

[Download JExcel Pro](https://www.jexcel.net) [Download JExcel CE](https://bossanova.uk/jexcel/)

## Documentation

### Dependencies

- [JExcel Pro v5](https://www.jexcel.net/v5) or [JExcel Pro v7](https://www.jexcel.net/v7)

- With default options of plugins, you should use [Material Design icons](https://material.io/resources/icons/). But you can you fontawesome

```HTML
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
 ```   

### Options of plugins

<table>
	<thead>
		<tr>
			<th>Option name</th>
			<th>Type</th>
			<th>Default Value</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>icon_changeColumnType</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">ballot</i></code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewColumnBefore</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">add</i></code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewColumnAfter</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">add</i></code></td>
		</tr>
		<tr>
			<td><code>icon_deleteSelectedColumns</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">delete</i></code></td>
		</tr>
		<tr>
			<td><code>icon_renameThisColumn</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">create</i></code></td>
		</tr>
		<tr>
			<td><code>icon_orderAscending</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">sort</i></code></td>
		</tr>
		<tr>
			<td><code>icon_orderDescending</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">sort</i></code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewRowBefore</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">add</i></code></td>
		</tr>
		<tr>
			<td><code>icon_insertANewRowAfter</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">add</i></code></td>
		</tr>
		<tr>
			<td><code>icon_deleteSelectedRows</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">delete</i></code></td>
		</tr>
		<tr>
			<td><code>icon_addComments</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">insert_comment</i></code></td>
		</tr>
		<tr>
			<td><code>icon_clearComments</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">clear</i></code></td>
		</tr>
		<tr>
			<td><code>icon_cut</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">content_cut</i></code></td>
		</tr>
		<tr>
			<td><code>icon_copy</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">content_copy</i></code></td>
		</tr>
		<tr>
			<td><code>icon_paste</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">content_paste</i></code></td>
		</tr>
		<tr>
			<td><code>icon_saveAs</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">save</i></code></td>
		</tr>
		<tr>
			<td><code>icon_about</code></td>
			<td><code>String</code></td>
			<td><code><i class="context_icon material-icons">info</i></code></td>
		</tr>
		<tr>
			<td><code>css</code></td>
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

### get started with options

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