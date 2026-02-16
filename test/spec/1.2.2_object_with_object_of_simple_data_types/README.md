### Object with Object of Simple Data Types
This use case demonstrates storing an object that contains an object that contains simple data types.
#### The Model to Store
In this case, `address` references an object that contains only simple data. 
```json
{
  "firstName": "Tony",
  "lastName": "Stark",
  "age": 48,
  "address": {
    "streetAddress": "10880 Malibu Point",
    "city": "Malibu",
    "state": "CA",
    "postalCode": "90265"
  }
}
```
#### Resulting Directory Structure
Like the previous example, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this object contains an object, it also has a sub-directory named `address` named after the key that contains `address`'s properties in its own `_this.yaml` file.
```txt
model
├── address
│   └── _this.yaml
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
```yaml
firstName: Tony
lastName: Stark
age: 48
address: ((address/_this.yaml))
```
In this file, we use the convention of enclosing the filename in double parentheses, `address/_this.yaml` to reference the file storing the object. 
##### `model/address/_this.yaml`
```txt
streetAddress: 10880 Malibu Point
city: Malibu
state: CA
postalCode: '90265'
```
This yaml file stores the object, and because the object only has simple data types, we can store it as a single file. 
