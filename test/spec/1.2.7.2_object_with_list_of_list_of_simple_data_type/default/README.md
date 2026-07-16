### Object with List of List of Simple Data Type
#### The Model to Store
In this case, we have an object that contains a list of numbers that contains lists of numbers.
```json
{
  "matrix": [
    [
      1,
      2,
      3
    ],
    [
      4,
      5,
      6
    ],
    [
      7,
      8,
      9
    ]
  ]
}
```
#### Generated Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this property is a list, `model/_this.yaml` references the relative filepath of the list using the double-parentheses convention `((matrix.yaml))`. 
Because the list contains lists, yaml files must be generated for each list.  To ensure proper storage, each yaml file receives a unique 6 digit ID, e.g. `matrix_506E59.yaml`. Because the lists contain simple data, the simple data is included directly in each lists' yaml files.
```txt
model
├── matrix_506E59.yaml
├── matrix_A28836.yaml
├── matrix_E16F4F.yaml
├── matrix.yaml
└── _this.yaml
```
#### Generated Files
##### `model/_this.yaml`
```yaml
matrix: ((matrix.yaml))
```
##### `model/matrix.yaml`
```yaml
- ((matrix_E16F4F.yaml))
- ((matrix_506E59.yaml))
- ((matrix_A28836.yaml))
```
##### `model/matrix_506E59.yaml`
```yaml
- 4
- 5
- 6
```
##### `model/matrix_A28836.yaml`
```yaml
- 7
- 8
- 9
```
##### `model/matrix_E16F4F.yaml`
```yaml
- 1
- 2
- 3
```
