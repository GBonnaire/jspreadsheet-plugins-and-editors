
## JExcel Plugin : Persistance Flag

 Replace Notification persistance and cloud by discret flag on toolbar

![preview](https://user-images.githubusercontent.com/52194475/94907348-4e4ed600-04a0-11eb-9039-30c5feadb5ca.png)


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
			<td><code>dateFormat</code></td>
			<td>Use in text <code>{date}</code> for add datetime</td>
			<td><code>Object</code></td>
			<td><code>{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }</code></td>
		</tr>
		<tr>
			<td><code>icon_error</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>error</code></td>
		</tr>
    <tr>
			<td><code>icon_success</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>check_circle</code></td>
		</tr>
    <tr>
			<td><code>icon_progress</code></td>
			<td>Material icon code</td>
			<td><code>String</code></td>
			<td><code>cached</code></td>
		</tr>
    <tr>
			<td><code>showText</code></td>
			<td>Show text with flag
      </td>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
		</tr>
    <tr>
      <td><code>text_error</code></td>
			<td>Text for flag
      </td>
			<td><code>String</code></td>
			<td><code>'Not updated'</code></td>
    </tr>
    <tr>
      <td><code>text_progress</code></td>
			<td>Text for flag
      </td>
			<td><code>String</code></td>
			<td><code>'Updating'</code></td>
    </tr>
    <tr>
      <td><code>text_success</code></td>
			<td>Text for flag
      </td>
			<td><code>String</code></td>
			<td><code>'Updated {date}'</code></td>
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

<script src="/path/to/jexcel.persistanceFlag.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
        toolbar: true, // or Array/object
	...
	plugins: [
      ...
      { name:'persistanceFlag', plugin:jexcel_persistanceFlag },
      ...  
    ],
    ...
});
```

#### Example with options and style

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.persistanceFlag.js"></script>

<style>
.jexcel-flagPersistance i {
    padding: 5px;
    font-size: 1.1em;
}

.jexcel-flagPersistance span {
    color: #999999;
    font-size: 1em;
}
</style>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
        toolbar: true, // or Array/object
	...
	plugins: [
      ...
      { name:'persistanceFlag', plugin:jexcel_persistanceFlag, options:{showText:false} },
      ...  
    ],
    ...
});
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
