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
			<td>```icon_changeColumnType```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">ballot</i>```</td>
		</tr>
		<tr>
			<td>```icon_insertANewColumnBefore```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">add</i>```</td>
		</tr>
		<tr>
			<td>```icon_insertANewColumnAfter```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">add</i>```</td>
		</tr>
		<tr>
			<td>```icon_deleteSelectedColumns```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">delete</i>```</td>
		</tr>
		<tr>
			<td>```icon_renameThisColumn```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">create</i>```</td>
		</tr>
		<tr>
			<td>```icon_orderAscending```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">sort</i>```</td>
		</tr>
		<tr>
			<td>```icon_orderDescending```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">sort</i>```</td>
		</tr>
		<tr>
			<td>```icon_insertANewRowBefore```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">add</i>```</td>
		</tr>
		<tr>
			<td>```icon_insertANewRowAfter```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">add</i>```</td>
		</tr>
		<tr>
			<td>```icon_deleteSelectedRows```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">delete</i>```</td>
		</tr>
		<tr>
			<td>```icon_addComments```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">insert_comment</i>```</td>
		</tr>
		<tr>
			<td>```icon_clearComments```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">clear</i>```</td>
		</tr>
		<tr>
			<td>```icon_cut```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">content_cut</i>```</td>
		</tr>
		<tr>
			<td>```icon_copy```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">content_copy</i>```</td>
		</tr>
		<tr>
			<td>```icon_paste```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">content_paste</i>```</td>
		</tr>
		<tr>
			<td>```icon_saveAs```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">save</i>```</td>
		</tr>
		<tr>
			<td>```icon_about```</td>
			<td>```String```</td>
			<td>```<i class="context_icon material-icons">info</i>```</td>
		</tr>
		<tr>
			<td>```css```</td>
			<td>```String```</td>
			<td>```font-size:small; vertical-align:text-top; float:left; margin-left: -20px; margin-right: 2px;```</td>
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

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License