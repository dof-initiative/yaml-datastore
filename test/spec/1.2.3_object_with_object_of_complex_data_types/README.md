### Object with Object of Complex Data Types
This use case demonstrates storing an object that contains an object with complex data.
#### The Model to Store
In this case, the model contains an object `myObj` with a nested object `personInfo`, a multi-line string `lyrics_txt`, and a list `primeNumbers`. 
```json
{
  "myObj": {
    "lyrics_txt": "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go.",
    "personInfo": {
      "name": "John Smith",
      "age": 42,
      "attending": true,
      "plusOne": null,
      "state": "WA"
    },
    "primeNumbers": [
      2,
      3,
      5,
      7,
      11
    ]
  }
}
```
#### Resulting Directory Structure
Like the previous examples, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. The `model/_this.yaml` contains the key `myObj` and the relative filepath using the double parentheses convention `((myObj/_this.yaml))` because this object contains complex data.
Because `myObj` contains complex data, it needs its own directory also includes additional files and directories. The `myObj/_this.yaml` file references the relative filepaths using the double parentheses convention: `((lyrics.txt))`, `((personInfo/_this.yaml))`, and `((primeNumbers.yaml))`. 
* The nested object results in a sub-directory named `personInfo` containing its properties in a `_this.yaml` file. 
* The multi-line string results in a text file named `lyrics.txt` containing the string content in the `myObj` directory. 
* The list results in a yaml file named `primeNumbers.yaml` in the `myObj` directory.
```txt
model
├── myObj
│   ├── lyrics.txt
│   ├── personInfo
│   │   └── _this.yaml
│   ├── primeNumbers.yaml
│   └── _this.yaml
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
```yaml
myObj: ((myObj/_this.yaml))
```
##### `model/myObj/_this.yaml`
```yaml
lyrics_txt: ((lyrics.txt))
personInfo: ((personInfo/_this.yaml))
primeNumbers: ((primeNumbers.yaml))
```
##### `model/myObj/lyrics.txt`
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
##### `model/myObj/primeNumbers.yaml`
```yaml
- 2
- 3
- 5
- 7
- 11
```
##### `model/myObj/personInfo/_this.yaml`
```yaml
name: John Smith
age: 42
attending: true
plusOne: null
state: WA
```
