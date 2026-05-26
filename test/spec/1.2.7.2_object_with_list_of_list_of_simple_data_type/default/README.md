### Object with List of List of Simple Data Type
#### The Model to Store
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
