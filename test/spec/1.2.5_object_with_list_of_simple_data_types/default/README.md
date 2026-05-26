### Object with List of Simple Data Types
#### The Model to Store
In this case an object contains an object `personInfo` with a list of simple data. 
```json
{
  "personInfo": [
    "John Smith",
    42,
    true,
    null,
    "WA"
  ]
}
```
#### Resulting Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this property is a list, `model/_this.yaml` references the relative filepath of the list using the double-parentheses convention `((personInfo.yaml))`. Since this list contains only simple data types, all its properties can be stored directly in that yaml file. 
```txt
model
├── personInfo.yaml
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
```yaml
personInfo: ((personInfo.yaml))
```
##### `model/personInfo.yaml`
```yaml
- John Smith
- 42
- true
- null
- WA
```
