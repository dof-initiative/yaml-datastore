### Object with List of Simple Data Type
#### The Model to Store
In this case, an object contains some simple data `companyName` and `foundedYear` and a list `employees` containing simple data. 
```json
{
  "companyName": "ACME, Inc",
  "employees": [
    "John",
    "Anna",
    "Peter"
  ],
  "foundedYear": 1949
}
```
#### Resulting Directory Structure
Like the previous examples, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. The `model/_this.yaml` directly contains the simple data `companyName` and `foundedYear`, but the list `employees` requires creating the `employees.yaml` file. So the relative filepath is referenced using the double parentheses convention `((employees.yaml))`. Since this list contains only simple data types, all its properties can be stored directly in yaml file. 
```txt
model
├── employees.yaml
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
```yaml
companyName: ACME, Inc
employees: ((employees.yaml))
foundedYear: 1949
```
##### `model/employees.yaml`
```yaml
- John
- Anna
- Peter
```
