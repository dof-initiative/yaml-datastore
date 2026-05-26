### Object with List of Objects of Simple Data Types
#### The Model to Store
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
