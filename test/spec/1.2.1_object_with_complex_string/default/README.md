### Object with Complex String
This use case demonstrates storing an object that contains a complex string.
#### The Model to Store
In this case, `lyrics_txt` contains a multi-line string. Because the key will reference a text file, the convention `_txt` maps to `.txt`.
```json
{
  "songTitle": "Mary Had a Little Lamb",
  "album": "Classic Childrens Songs 2",
  "track": 17,
  "lyrics_txt": "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go."
}
```
#### Resulting Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties.
```txt
model
├── lyrics.txt
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
The first three properties in this file are simple data, and thus in one line. The fourth property, `lyrics_txt`, is a complex string, therefore we use the convention of enclosing the filename where the string contents will be stored in double parentheses, `((lyrics.txt))`.
```yaml
songTitle: Mary Had a Little Lamb
album: Classic Childrens Songs 2
track: 17
lyrics_txt: ((lyrics.txt))
```
##### `model/lyrics.txt`
This text file stores the data for the multi-line string that was stored in `lyrics_txt`.
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
