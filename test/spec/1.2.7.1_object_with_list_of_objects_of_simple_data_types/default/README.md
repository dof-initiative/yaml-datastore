### Object with List of Objects of Simple Data Types
#### The Model to Store
In this case, we have an object that contains a list of objects (avengers) containing simple data types (their name and age).
```json
{
  "avengers": [
    {
      "firstName": "Steve",
      "lastName": "Rogers",
      "age": 94
    },
    {
      "firstName": "Tony",
      "lastName": "Stark",
      "age": 48
    },
    {
      "firstName": "Thor",
      "lastName": "Odinson",
      "age": 1500
    }    
  ]
}
```
#### Generated Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this property is a list, `model/_this.yaml` references the relative filepath of the list using the double-parentheses convention `((avengers.yaml))`. 
Because the list contains objects, directories must be generated for each of the objects. To ensure proper storage, each directory receives a unique 6 digit ID. The releative filepath to these directories is stored in the yaml file using the double parentheses convention `((model/avengers_506E59))`, etc.  Because the objects contain simple data, it can be included directly in the each object's `_this.yaml` files.
```txt
model
├── avengers_506E59
│   └── _this.yaml
├── avengers_A28836
│   └── _this.yaml
├── avengers_E16F4F
│   └── _this.yaml
├── avengers.yaml
└── _this.yaml
```
#### Generated Files
##### `model/_this.yaml`
```yaml
avengers: ((avengers.yaml))
```
##### `model/avengers.yaml`
```yaml
- ((avengers_E16F4F/_this.yaml))
- ((avengers_506E59/_this.yaml))
- ((avengers_A28836/_this.yaml))
```
##### `model/avengers_506E59/_this.yaml`
```yaml
firstName: Tony
lastName: Stark
age: 48
```
##### `model/avengers_A28836/_this.yaml`
```yaml
firstName: Thor
lastName: Odinson
age: 1500
```
##### `model/avengers_E16F4F/_this.yaml`
```yaml
firstName: Steve
lastName: Rogers
age: 94
```
