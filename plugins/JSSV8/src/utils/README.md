## jspreadsheet Plugin : Utils

The utils plugin add features for rows, columns, sheet, viewport. Like Move row, Duplicate row, hide/show Column, hide sheet, select sheet, zoom 

This plugin is **Free**

### Features

- Move rows
- Duplicate Row
- Hide Sheet
- Hide columns / show columns
- Hide rows / show rows
- Zoom (only for v9/v10 - beta version)


## What is jSpreadsheet ?

jspreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8) 
-   or
- [jSpreadsheet Pro v9](https://www.jspreadsheet.com/v9)
- or
- [jSpreadsheet Pro v10](https://www.jspreadsheet.com/v10)

if you have a lot a plugins, add on the top autoWidth

### Options of plugin
List of defaults options that you can defined 
```javascript
options = {
    allow: {
        moveRow: true,
        duplicateRow: true,
        hideSheet: true,
        hideColumn: true,
        hideRow: true,
        zoom: true,
    },
    icon: {
        moveUpRow:'arrow_upward',
        moveDownRow:'arrow_downward',
        duplicateRow:'content_copy',
        hideRow:'visibility_off',
        showRow:'visibility',
        showRows: 'visibility',
        hideColumn:'visibility_off',
        showColumn:'visibility',
        showColumns:'visibility',
        hideWorksheet:'visibility_off',
    },
    text: {
        moveUpRow: 'Move up row(s) selected',
        moveDownRow: 'Move down row(s) selected',
        duplicateRow: 'Duplicate row(s) selected',
        hideRow: 'Hide row(s) selected',
        showRow: 'Show hidden row ({0})',
        showRows: 'Show hidden rows',
        hideColumn: 'Hide column(s) selected',
        showColumn: 'Show hidden column ({0})',
        showColumns: 'Show hidden columns',
        hideWorksheet: 'Hide this worksheet',
    }
};
```

### translation
You use jSuites translate to change text to your language
```javascript
jSuites.setDictionary({
    /* ... */
    
    /* ... Utils Translation ... */
    'Move up row(s) selected' : "YOURTRANLSATION",
    'Move down row(s) selected' : "YOURTRANLSATION",
    'Duplicate row(s) selected' : "YOURTRANLSATION",
    'Hide row(s) selected' : "YOURTRANLSATION",
    'Show hidden row ({0})' : "YOURTRANLSATION",
    'Show hidden rows': "YOURTRANSLATION",
    'Hide column(s) selected' : "YOURTRANLSATION",
    'Show hidden column ({0})' : "YOURTRANLSATION",
    'Show hidden columns': "YOURTRANSLATION",
    'Hide this worksheet' : "YOURTRANLSATION",
    'Set new zoom value' : "YOURTRANLSATION",
    '(hidden)' : "YOURTRANLSATION",
    'New tab' : "YOURTRANLSATION",
    
    /* ... */
});
```

### Get started

Header on page
```HTML
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/index.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet/dist/jspreadsheet.min.css" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.min.css" type="text/css" />

<script src="/path/to/utils.min.js"></script>
```

Initialize plugin on jspreadsheet
```JavaScript
jspreadsheet(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'utils', plugin:jss_utils },
      ...  
    ],
    ...
});
```


## CDN

You can use this CDN link

```HTML
<script src="https://cdn.jsdelivr.net/gh/GBonnaire/jspreadsheet-plugins-and-editors@latest/plugins/JSSV8/dist/utils.min.js"></script>
```

## NPM
npm install @jspreadsheet/utils
```javascript
import jss_utils from '@jspreadsheet/utils';
```

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License
