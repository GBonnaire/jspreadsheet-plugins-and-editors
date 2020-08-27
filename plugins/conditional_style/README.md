## JExcel Plugin : Conditional Style

The Conditional Style plugin like conditional style of Excel. It works even if access to the clipboard is denied or in error.

![Preview plugin](https://github.com/Guillaume-Bo/jexcel-plugins-and-editors/blob/master/plugins/conditional_style/preview.png)

This plugin is **Paid** Contact me if interested [contact@gbonnaire.fr](mailto://contact@gbonnaire.fr)

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
			<td><code>rules</code></td>
			<td>Define all rules in order of apply</td>
			<td><code>Array of rules</code></td>
			<td><code>[]</code></td>
		</tr>
		<tr>
			<td><code>pathClassName</code></td>
			<td>Path css class name. When you apply style, this plugin create a new class CSS, and this path can specific spreadsheet to apply</td>
			<td><code>String</code></td>
			<td><code>.jexcel tbody tr td</code></td>
		</tr>
	</tbody>
</table>


#### Options of Rules
<table>
	<thead>
		<tr>
			<th>Option name</th>
			<th>Description</th>
			<th>Type</th>
			<th>Example</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Range (optional)</code></td>
			<td>Range of cells. Can be add multiple ranges separate by <code>;</code>. If not defined, by default is all cells of sheet<br>
			Other syntax available : 
			1:1 = All data of row 1
			A:A = All data of column A</td>
			<td><code>String</code></td>
			<td><code>{range:"B1:B10;1:1", criteria: "Honda", class:"cellAlert"},</code></td>
		</tr>
		<tr>
			<td><code>criteria (optional)</code></td>
			<td>Is condition for apply rules. Critera is directly a value or a formula. If not defined, by default is apply to all cells of sheet</td>
			<td><code>String / Int / Float / Boolean</code></td>
			<td><code>{criteria: "=IF(MOD(ROW(),2)==1, true, false)", style:{"background-color": "lightblue"}, stopIfTrue:true},</code></td>
		</tr>
		<tr>
			<td><code>style</code></td>
			<td>Style apply on cell if result of criteria is right</td>
			<td><code>String</code></td>
			<td><code>{criteria: "=IF(MOD(ROW(),2)==1, true, false)", style:{"background-color": "lightblue"}},</code></td>
		</tr>
		<tr>
			<td><code>class</code></td>
			<td>Class CSS apply on cell if result of critera is right</td>
			<td><code>String</code></td>
			<td><code>{range:"B1:B10;1:1", criteria: "Honda", class:"cellAlert"},</code></td>
		</tr>
		<tr>
			<td><code>stopIfTrue</code></td>
			<td>this option like Excel, if rule is apply, stop apply conditional style for this cell (no go check next rule). By Default is <code>false</code></td>
			<td><code>Boolean</code></td>
			<td><code>&lt;i class="context_icon material-icons"&gt;create&lt;/i&gt;</code></td>
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
			<td><code>addRule(Range<String>, Criteria<String|Int|Float|Boolean>, Style<String>, Class<String>, Position<Int>) -> Void</code></td>
			<td>Create new rule</td>
			<td><code>jexcel.current.plugins.conditionalstyle.addRule("B:B", ">3000", "color: red;", null, 1);</code></td>
		</tr>
		<tr>
			<td><code>editRule(Position<Int>, Range<String>, Criteria<String|Int|Float|Boolean>, Style<String>, Class<String>) -> Void</code></td>
			<td>Edit rule on specific position</td>
			<td><code>jexcel.current.plugins.conditionalstyle.editRule(1, "B:B", "<3000", "color: red;", null);</code></td>
		</tr>
		<tr>
			<td><code>getCSS() -> String</code></td>
			<td>Get all CSS of styles. Use for example with print plugin</td>
			<td><code>{ name:'print', plugin:jexcel_print, options:{style:function(obj) { return obj.plugins.conditionalstyle.getCSS(); }} },</code></td>
		</tr>
		<tr>
			<td><code>moveRulePosition(Position<Int>, NewPosition<Int>) -> Void</code></td>
			<td>Move rule to specific position</td>
			<td><code>jexcel.current.plugins.conditionalstyle.moveRulePosition(1, 3);</code></td>
		</tr>
		<tr>
			<td><code>removeRule(Position<Int>) -> Void</code></td>
			<td>Remove rule on specific position</td>
			<td><code>jexcel.current.plugins.conditionalstyle.removeRule(3);</code></td>
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

<script src="/path/to/jexcel.conditionalstyle.js"></script>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
      { name:'conditionalstyle', plugin:jexcel_conditionalstyle},
      ...  
    ],
    ...
});
```
#### Example
Header on page
```HTML
<script src="https://jexcel.net/v7/jexcel.js"></script>
<script src="https://jexcel.net/v7/jsuites.js"></script>
<link rel="stylesheet" href="https://jexcel.net/v7/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://jexcel.net/v7/jexcel.css" type="text/css" />

<script src="/path/to/jexcel.conditionalstyle.js"></script>

<style>    
    .jexcel tbody tr td.cellAlert {
        background-color: #f46e42!important;
        color: #ffffff;
    }    
</style>
```

Initialize plugin on JExcel
```JavaScript
jexcel(document.getElementById('spreadsheet'), {
	...
	plugins: [
      ...
   		{ name:'conditionalstyle', plugin:jexcel_conditionalstyle, options:{rules:[
                {range:"B1:B10;1:1", criteria: "Honda", class:"cellAlert"}, // #Rule 1 : For Range B1:B10 and Row 1, cell = Honda use ClassCss cellAlert
                {range:"G:G", criteria: ">3000", style:{"color": "red", "font-weight":"bold", "background-color": "LightPink"}, stopIfTrue:true}, // #Rule 2 : All data of Column G if value > 3000, apply this style and stop here (no check next rules if true)
                {range:"F:F", criteria: true, style:"background-color:green", stopIfTrue:true}, // #Rule 3 : All data of Column F, if value = true (checkbox), apply style and stop here (no check next rules if true)
                {criteria: "=IF(MOD(ROW(),2)==1, true, false)", style:{"background-color": "lightblue"}},  // #Rule 4 All sheet, If rule is even, apply style                      
        ]}},
      ...  
    ],
    ...
});

## Copyright and license

Copyright [GBonnaire.fr](https://www.gbonnaire.fr) and Code released under the MIT License