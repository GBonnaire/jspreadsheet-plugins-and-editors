## jSpreadsheet Plugin : Copy Paste Advanced

The Copypaste_advanced plugin improves the copy paste functionality of jSpreadsheet. It works even if access to the clipboard is denied or in error.

![preview](https://user-images.githubusercontent.com/52194475/91473978-ece08980-e899-11ea-9a89-ad0f8bc89d42.png)

This plugin is **Free**

### Features

- Add items cut, copy, paste on default toolbar
- Add item paste on default context menu when it is not present
- Upgrade copy/paste of jSpreadsheet when clipboard access is denied
- Override copy methods of jSpreadsheet
- Can copy scale like Excel
- Work on Mobile
- Paste data from Excel (with or without style)
- Add items on topmenu bar (plugin) where you want with position property
- **NEW** : Multiple select cells with Ctrl pressed, copy this multiple cells and paste


## What is jSpreadsheet ?

jSpreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8) 
  or
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
			<td><code>allow_pastestyle</code></td>
			<td>Allow paste style on copy/paste</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>position_toolbar</code></td>
			<td>Define position in toolbar (null: default behavior, found first divisor and add after, false: not add, int: add specific position</td>
			<td><code>int/null/false</code></td>
			<td><code>null</code></td>
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
			<td><code>text_paste_special</code></td>
			<td><code>Paste special</code></td>
		</tr>
		<tr>
			<td><code>text_paste_only_style</code></td>
			<td><code>Paste only format</code></td>
		</tr>
		<tr>
			<td><code>text_paste_only_value</code></td>
			<td><code>Paste only value</code></td>
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
			<td><code>copy(*Optional* Boolean cut) → Array</code></td>
			<td>Copy selected cells. If copy(true), you cut selected cell. This methods return same result of jspreadsheet.current.copy().</td>
			<td><code>jspreadsheet.current.plugins.copypaste_adv.copy();</code></td>
		</tr>
		<tr>
			<td><code>paste(*Optional* Boolean OnlyValue) → Void</code></td>
			<td>paste data copied on selected cell</td>
			<td><code>jspreadsheet.current.plugins.copypaste_adv.paste();</code></td>
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

<script src="/path/to/copypaste_advanced.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'copypaste_adv', plugin:jss_copypaste_advanced},
      ...  
    ],
    ...
});
```

#### Example of code for custom toolbar

```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	toolbar: [
      ...
        {
	        content: 'content_cut',
	        onclick: function() {
	            if (jspreadsheet.current.selectedCell) {
	                jspreadsheet.current.copy(true);
	            }
	        }
	    },
	    {
	        content: 'content_copy',
	        onclick: function() {
	            if (jspreadsheet.current.selectedCell) {
	                jspreadsheet.current.copy();
	            }
	        }
	    },
	    {
	        content: 'content_paste',
	        onclick: function() {
	            if (jspreadsheet.current.selectedCell) {
	                jspreadsheet.current.parent.plugins.copypaste_adv.paste();
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
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/copypaste_advanced.min.js"></script>
```

## NPM
npm install @jspreadsheet/copypaste_advanced
```javascript
import jss_copypaste_advanced from  '@jspreadsheet/copypaste_advanced';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
