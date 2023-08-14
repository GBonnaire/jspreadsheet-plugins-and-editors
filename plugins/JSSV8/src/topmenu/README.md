## jSpreadsheet Plugin : Top menu

The topmenu plugin add a top menu bar on jSpreadsheet.

![preview](https://user-images.githubusercontent.com/52194475/118120684-8d5ae780-b3f0-11eb-911d-1b38416b9997.png)

This plugin is **Free**

### Features

- Add top menu bar
- Add function on instance for add top menu bar
- Load item top menu in other plugins
- Menu can use sub menu



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
			<td><code>menus</code></td>
			<td>Define your menus</td>
			<td><code>Object</code></td>
			<td><i>Default menu</i></td>
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
			<td><code>text_file</code></td>
			<td><code>File</code></td>
		</tr>
		<tr>
			<td><code>text_edit</code></td>
			<td><code>Edit</code></td>
		</tr>
		<tr>
			<td><code>text_view</code></td>
			<td><code>View</code></td>
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
			<td><code>add(String title, *Optional* Array/Function items, *Optional* Int position) → Void</code></td>
			<td>add new top menu. You can use directly <code>instance.addTopmenu</code> with same arguments</td>
			<td><code>jspreadsheet.current.plugins.topmenu.add("Format");</code></td>
		</tr>
		<tr>
			<td><code>refresh() → Void</code></td>
			<td>Refresh top menu</td>
			<td><code>jspreadsheet.current.plugins.topmenu.refresh();</code></td>
		</tr>
	</tbody>
</table>

### Menus with function

You can use function for have dynamics items.

use this template :
```javascript
function (element, instance, menuButton) {
   var items = [];

   /* you code for add dynamics items with condition */

   return items;
}
```

Example :
```javascript
function (element, instance, menuButton) {
   var items = [];

   if(instance.options.about == true) { // show about item
       items.push({
            title:'About',
            onclick:function() {
                alert('My about text')
            }
        });
   }

   if(instance.selectedCell[0] == 0 && instance.selectedCell[1] == 0) {
       items.push({
            title:'You have selected A1',
            disable: true
            onclick:function() {  }
        });
   }

   return items;
}
```

### Menu items properties

Item is based on contextmenu item. Use same items of contextmenu for build topmenu

Documentation available on [Quick Reference Contextmenu jSuites.net](https://jsuites.net/v4/contextmenu/quick-reference)

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>type: string</td>
            <td>Context menu item type: line | divisor | default</td>
        </tr>
        <tr>
            <td>icon: string</td>
            <td>Context menu icon key. (Material icon key icon identification)</td>
        </tr>
        <tr>
            <td>id: string</td>
            <td>HTML id property of the item DOM element</td>
        </tr>
        <tr>
            <td>disabled: boolean</td>
            <td>The item is disabled</td>
        </tr>
        <tr>
            <td>onclick: function</td>
            <td>Specific onclick event for the element.</td>
        </tr>
        <tr>
            <td>shortcut: string</td>
            <td>A short description or instruction for the item. Normally a shortcut.</td>
        </tr>
        <tr>
            <td>tooltip: string</td>
            <td>Show this text when the user mouse over the element</td>
        </tr>
        <tr>
            <td>submenu: Array of objects</td>
            <td>Submenu items</td>
        </tr>
    </tbody>
</table>

### Menu on plugin

On your plugin, add function on your object like contextMenu : 

example : 
```javascript
function example_plugin_jss(instance, options) {
   var plugin = {};
   
   /* ... your code of your plugin ...*/
   
   plugin.topMenu = function(name, items, menuButton, shortcut_base) { 
       /*... your code for new items ...*/
       return items;
   }
   
   /* ... your code of your plugin ...*/
   
   return plugin;
}
```

this function is call when top menu is open

Arguments of `topMenu`:
- `name` : Name of top menu
- `items` : Array
- `menuButton` : Button in top menu
- `shortcut_base` = "CTRL +" or "⌘ +"

this function must return Array of items


### Get started

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/topmenu.min.js"></script>
<link rel="stylesheet" href="/path/to/topmenu.min.css" type="text/css" />
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'topmenu', plugin:jss_topmenu},
      ...  
    ],
    ...
});
```

## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/topmenu.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/topmenu.min.css" type="text/css" />
```

## NPM
npm install @jspreadsheet/topmenu
```javascript
import jss_topmenu from  '@jspreadsheet/topmenu';
import '@jspreadsheet/topmenu/style.css';
```

## Copyright and license

Copyright [GBonnaire.fr](https://repo.gbonnaire.fr) and Code released under the MIT License
