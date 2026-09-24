### Object with Two Complex Strings
#### The Model to Store
In this case, we have an object that contains two complex strings. 
```json
{
  "verse1": "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go.",
  "verse2": "He followed her to school one day\nWhich was against the rule;\nIt made the children laugh and play,\nTo see a lamb at school."
}
```
#### Generated Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because each of the properties are complex strings, text files are generated named to store the multiple lines of text. `model/_this.yaml` references the relative filepath of these files using the double-parentheses convention, e.g. `((verse1.txt))`. Because the text is simple data, it is included directly in the text files.
```txt
model
├── _this.yaml
├── verse1
└── verse2
```
#### Generated Files
##### `model/_this.yaml`
```yaml
verse1: ((verse1))
verse2: ((verse2))
```
