### Object with List of Complex Strings
#### The Model to Store
In this case we have an object that contains a list `verses_txt` containing one string and three multi-line strings.
```json
{
  "songTitle": "Mary Had a Little Lamb",
  "album": "Classic Childrens Songs 2",
  "track": 17,
  "verses_txt": [
    "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go.", 
    "He followed her to school one day\nWhich was against the rule;\nIt made the children laugh and play,\nTo see a lamb at school.", 
    "And so the teacher turned him out,\nBut still he lingered near;\nAnd waited patiently about\nTill Mary did appear", 
    "\"What makes the lamb love Mary so?\""
  ]
}
```
#### Generated Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this property is a list, `model/_this.yaml` references the relative filepath of the list using the double-parentheses convention `((verses_txt.yaml))`. 
Because the list contains simple data and multi-line strings, the simple data can be included directly, but text files must be generated for each of multi-line strings To ensure proper storage, each text file receives a unique 6 digit ID. The relative filepath to these text files is stored in the yaml file using the double parentheses convention `((verses_E16F4F.txt))`, `((verses_506E59.txt))`, and `((verses_A28836.txt))`.
```txt
model
├── _this.yaml
├── verses_506E59.txt
├── verses_A28836.txt
├── verses_E16F4F.txt
└── verses_txt.yaml
```
#### Generated Files
##### `model/_this.yaml`
```yaml
songTitle: Mary Had a Little Lamb
album: Classic Childrens Songs 2
track: 17
verses_txt: ((verses_txt.yaml))
```
##### `model/verses_txt.yaml`
```yaml
- ((verses_E16F4F.txt))
- ((verses_506E59.txt))
- ((verses_A28836.txt))
- '"What makes the lamb love Mary so?"'
```
##### `model/verses_506E59.txt`
```txt
He followed her to school one day
Which was against the rule;
It made the children laugh and play,
To see a lamb at school.
```
##### `model/verses_A28836.txt`
```txt
And so the teacher turned him out,
But still he lingered near;
And waited patiently about
Till Mary did appear
```
##### `model/verses_E16F4F.txt`
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
