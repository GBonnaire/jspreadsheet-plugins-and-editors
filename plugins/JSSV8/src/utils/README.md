## jspreadsheet Plugin : Utils

The utils plugin add features for rows, columns, sheet, viewport. Like Move row, Duplicate row, hide/show Column, hide sheet, select sheet, zoom 

This plugin is **Free**


### Features

- Move rows
- Duplicate Row
- Hide Sheet
- Hide columns / show columns
- Hide rows / show rows
- Zoom (only for v9 - beta version)


## What is jSpreadsheet ?

jspreadsheet, a lightweight Vanilla JavaScript plugin, can help you create exceptional web-based interactive tables and spreadsheets. Compatible with most widely-used spreadsheet software, such as Excel or Google Spreadsheet, it offers users an unrivalled Excel-like user experience. It also works well with prominent modern frameworks and flexibly utilizes a large collection of events, extensions and configurations to meet different application requirements. Impress your clients with a better user experience and a great dynamic interactive data management tool.

- [Download jSpreadsheet Pro](https://www.jspreadsheet.com) 

## Documentation

### Dependencies

- [jSpreadsheet Pro v8](https://www.jspreadsheet.com/v8) 
-   or
- [jSpreadsheet Pro v9](https://www.jspreadsheet.com/v9)

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
        hideColumn:'visibility_off',
        showColumn:'visibility',
        hideWorksheet:'visibility_off',
    },
    text: {
        moveUpRow: 'Move up row(s) selected',
        moveDownRow: 'Move down row(s) selected',
        duplicateRow: 'Duplicate row(s) selected',
        hideRow: 'Hide row(s) selected',
        showRow: 'Show row ({0})', // use {0} to set position for column title
        hideColumn: 'Hide column(s) selected',
        showColumn: 'Show column ({0})', // use {0} to set position for column title
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
    'Show row ({0})' : "YOURTRANLSATION",
    'Hide column(s) selected' : "YOURTRANLSATION",
    'Show column ({0})' : "YOURTRANLSATION",
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
<script src="https://jspreadsheet.com/v9/jspreadsheet.js"></script>
<script src="https://jsuites.net/v4/jsuites.js"></script>
<link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jspreadsheet.com/v9/jspreadsheet.css" type="text/css" />

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
