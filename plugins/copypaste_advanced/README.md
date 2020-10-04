## JExcel Plugin : Copy Paste Advanced

The Copypaste_advanced plugin improves the copy paste functionality of JExcel. It works even if access to the clipboard is denied or in error.

![preview](https://user-images.githubusercontent.com/52194475/91473978-ece08980-e899-11ea-9a89-ad0f8bc89d42.png)

This plugin is **Free**

### Features

- Add items cut, copy, paste on default toolbar
- Add item paste on default context menu when it is not present
- Upgrade copy/paste of JExcel when clipboard access is denied
- Override copy methods of JExcel
- Work on Mobile


## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JExcel Pro](https://www.jexcel.net) 
- [Download JExcel CE](https://bossanova.uk/jexcel/)

## Documentation

### Dependencies

- [JExcel Pro v7](https://www.jexcel.net/v7) 

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
			<td><code>copy(*Optional* Boolean cut) → Array</code></td>
			<td>Copy selected cells. If copy(true), you cut selected cell. This methods return same result of jexcel.current.copy().</td>
			<td><code>jexcel.current.plugins.copypaste_adv.copy();</code></td>
		</tr>
		<tr>
			<td><code>paste() → Void</code></td>
			<td>paste data copied on selected cell</td>
			<td><code>jexcel.current.plugins.copypaste_adv.paste();</code></td>
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

<script src="/path/to/jexcel.copypaste_advanced.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'copypaste_adv', plugin:jexcel_copypaste_advanced},
      ...  
    ],
    ...
});
```

#### Example of code for custom toolbar

```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	toolbar: [
      ...
        {
	        content: 'content_cut',
	        onclick: function() {
	            if (jexcel.current.selectedCell) {
	                jexcel.current.copy(true);
	            }
	        }
	    },
	    {
	        content: 'content_copy',
	        onclick: function() {
	            if (jexcel.current.selectedCell) {
	                jexcel.current.copy();
	            }
	        }
	    },
	    {
	        content: 'content_paste',
	        onclick: function() {
	            if (jexcel.current.selectedCell) {
	                jexcel.current.plugins.copypaste_adv.paste();
	            }
	        }
	    },
      ...  
    ],
    ...
});
```

## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/Guillaume-Bo/jexcel-plugins-and-editors@latest/plugins/copypaste_advanced/jexcel.copypaste_advanced.js"></script>
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
