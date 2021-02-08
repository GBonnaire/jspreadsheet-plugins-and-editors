## JExcel Plugin : auto Width

The autoWidth plugin add possibility to set auto width of columns.

This plugin is **Free**


### Features

- Auto width columns without width property or property:"auto" on intialization
- the min width is egal to defaultColWidth
- can setWidth with "auto" value


## What is JExcel ?

jExcel, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download JExcel Pro](https://www.jexcel.net) 
- [Download JSpreadsheet](https://www.jspreadsheet.com)

## Documentation

### Dependencies

- [JExcel Pro v7](https://www.jexcel.net/v7) 

if you have a lot a plugins, add on the top autoWidth
### Get started

Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.autoWidth.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'autoWidth', plugin:jss_autoWidth},
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/Guillaume-Bo/jexcel-plugins-and-editors@latest/plugins/autoWidth/jexcel.autoWidth.js"></script>
```

## NPM
Coming soon (March 2021)
```javascript
import download from '@jspreadsheet/autoWidth';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
