
## jSpreadsheet Plugin : persistence Flag

 Replace Notification persistence and cloud by discret flag on toolbar

![preview](https://user-images.githubusercontent.com/52194475/94907348-4e4ed600-04a0-11eb-9039-30c5feadb5ca.png)


This plugin is **Free**

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
			<td><code>cssProgress</code></td>
			<td>Your class css for animated icon in progress</td>
			<td><code>String</code></td>
			<td><code>(blank)</code></td>
		</tr>
  		<tr>
			<td><code>dateFormat</code></td>
			<td>Use in text <code>{date}</code> for add datetime or <code>{time}</code> for add onlytime</td>
			<td><code>Object</code></td>
			<td><code>{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }</code></td>
		</tr>
		<tr>
			<td><code>iconError</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>error</code></td>
		</tr>
    	<tr>
			<td><code>iconSuccess</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>check_circle</code></td>
		</tr>
    	<tr>
			<td><code>iconProgress</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>cached</code></td>
		</tr>
    	<tr>
			<td><code>showText</code></td>
			<td>Show text with flag</td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
		<tr>
			<td><code>showOnlyTime</code></td>
			<td>Show only type with flag</td>
			<td><code>Boolean</code></td>
			<td><code>false</code></td>
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
	        <td><code>textError</code></td>
			<td><code>'Not updated'</code></td>
	    </tr>
	    <tr>
	        <td><code>textProgress</code></td>
		    <td><code>'Updating'</code></td>
	    </tr>
	    <tr>
	        <td><code>textSuccess</code></td>
		    <td><code>'Updated {date}'</code></td>
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

<script src="/path/to/persistenceFlag.min.js"></script>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
        toolbar: true, // or Array/object
	...
	plugins: [
      ...
      { name:'persistenceFlag', plugin:jss_persistenceFlag },
      ...  
    ],
    ...
});
```

#### Example with options and style

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/persistenceFlag.min.js"></script>

<style>
.jss-flagpersistence i {
    padding: 5px;
    font-size: 1.1em;
}

.jss-flagpersistence span {
    color: #999999;
    font-size: 1em;
}
</style>
```

Initialize plugin on jSpreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
    toolbar: true, // or Array/object
	...
	plugins: [
      ...
      { name:'persistenceFlag', plugin:jss_persistenceFlag, options:{showText:false} },
      ...  
    ],
    ...
});
```

## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/persistenceFlag.min.js"></script>
```

## NPM
npm install @jspreadsheet/persistenceflag
```javascript
import jss_persistenceFlag from  '@jspreadsheet/persistenceflag';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
