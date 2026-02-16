### Object with Simple Data Types
This use case demonstrates the simplest pattern in YAML Datastore, an object where all properties are of simple data types. 
#### The Model to Store
In this case, all the supported simple data types are present in the model. 
```json
{
  "name": "John Smith",
  "age": 42,
  "attending": true,
  "plusOne": null,
  "state": "WA",
  "degrees": {},
  "aliases": [],
  "notes": ""
}
```
#### Resulting Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" and contains a `_this.yaml` file to store the object's properties. For this case, that is the only file present because we can store all of the properties in a single line. 
```txt
model
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
Since this is all simple data types, the on disk representation in YAML is a direct translation of the JSON representation to YAML representation. 
```yaml
name: John Smith
age: 42
attending: true
plusOne: null
state: WA
degrees: {}
aliases: []
notes: ''
```
