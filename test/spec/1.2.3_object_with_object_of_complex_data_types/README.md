### Object with Object of Complex Data Types
This use case demonstrates storing an object that contains an object with complex data.
#### The Model to Store
In this case, the model contains both multi-line strings and other objects.
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
#### Generated Directory Structure
As with all objects, the generated data structure for this example starts with a directory named `model` and the file `_this.yaml`. Because this object contains an object, there is now a sub-directory named `myObj` named after the object and contains its own `_this.yaml` file. Because the object contains complex data, this directory also includes additional files and directories.
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
#### Generated Files
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
