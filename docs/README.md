![Bart Simpson in front of chalkboard writing repeatedly "GIT IS NOT A DATABASE"](./bartsimpsonmeme.png)
<br>
**Git is not a database.—but what if it was?** With YAML datastore, you can make your data Git-friendly. 

YAML Datastore is a lightweight library that stores and manages data with structured plaintext files and YAML syntax, designed for use with version control systems. This enables you to gain the advantages of Git for your data—track changes at the feature level, store data across multiple systems, and merge data seamlessly. 
<br>

**Getting Started**

* New to YAML Data Store? Get [introduced](#introduction)
* Ready to install? Follow the [installation steps](#installation)
* Want to learn how YAML Datastore stores information based on data types? Read the [Overview](#overview) section
* Curious about use cases? Read about the [CRUD Operations](#crud-operations)
* Want to use the API? See [the API documentation](#api-v000)

<br>


**Contents** 

<!-- !toc (numbered) -->

1\. [Introduction](#introduction) <br>
1.1\. [What is YAML Datastore?](#what-is-yaml-datastore) <br>
1.2\. [Purpose of YAML Datastore](#purpose-of-yaml-datastore) <br>
2\. [Installation](#installation) <br>
3\. [Overview](#overview) <br>
3.1\. [Supported Data Types](#supported-data-types) <br>
3.2\. [Mapping Complex Data Types to Files](#mapping-complex-data-types-to-files) <br>
3.2.1\. [Multi-line Strings](#multi-line-strings) <br>
3.2.2\. [Lists](#lists) <br>
3.2.3\. [Objects](#objects) <br>
3.3\. [References to Subfiles](#references-to-subfiles) <br>
3.4\. [List Element IDs](#list-element-ids) <br>
4\. [CRUD Operations](#crud-operations) <br>
4.1\. [Store Use Cases](#store-use-cases) <br>
4.1.1\. [Object with Simple Data Types](#object-with-simple-data-types) <br>
4.1.2\. [Object with Complex String](#object-with-complex-string) <br>
4.1.3\. [Object with Object of Simple Data Types](#object-with-object-of-simple-data-types) <br>
4.1.4\. [Object with Object of Complex Data Types](#object-with-object-of-complex-data-types) <br>
4.1.5\. [Object with List of Simple Data Type](#object-with-list-of-simple-data-type) <br>
4.1.6\. [Object with List of Simple Data Types](#object-with-list-of-simple-data-types) <br>
4.1.7\. [Object with List of Complex Strings](#object-with-list-of-complex-strings) <br>
4.1.8\. [Object with List of Objects of Simple Data Types](#object-with-list-of-objects-of-simple-data-types) <br>
4.1.9\. [Object with List of List of Simple Data Type](#object-with-list-of-list-of-simple-data-type) <br>
5\. [API v0.0.0](#api-v000) <br>
5.1\. [Classes](#classes) <br>
5.2\. [Functions](#functions) <br>
6\. [License](#license) <br>
7\. [Contributions](#contributions) <br>

<!-- toc! -->

# Introduction

## What is YAML Datastore?
YAML Datastore is a lightweight Typescript library designed for observable, human-readable data storage and retrieval using YAML files. It serves as an alternative to traditional databases that do not store data in a version control-friendly way.

## Purpose of YAML Datastore
YAML Datastore exists because we rather than try to add Git-like features to how we store and manage data, we want to do data management in a way that fits in Git. We found that existing systems attempting to use Git as a backend didn't account properly for structure. YAML Datastore automatically manages this structure with easy to understand rules that we explain in the Usage section. 

# Installation
Install the library in the root directory of your project using npm or yarn.

  `npm install yaml-datastore` 

  `yarn add yaml-datastore` 

# Overview
This section provides comprehensive details about how the YAML Datastore library organizes and stores data on disk, the algorithm used to transform in-memory objects and lists into a collection of YAML files, the data types supported, and the conventions followed for file layout.

TO DO: link to Use Cases

YAML Datastore implements the standard CRUD operations for transforming in-memory objects and lists into structured YAML files and back.

The results helper class captures operation outcomes, including status and content.

## Supported Data Types
YAML Datastore supports any data types that are supported in YAML (and JSON). YAML Datastore categorizes these data types as simple or complex. 

Simple data is data that can be stored in a single line in a YAML file. This includes all scalar types; scalar types in YAML are strings without newlines, numbers, booleans, or nulls. It also includes empty lists and empty objects. 

Complex data is data that requires more than one line to be stored in YAML file. This includes multi-line strings, (non-empty) lists and objects. This is implemented by storing the data in separate files, referenced from their parent list or object. This enables these complex types to be accessed in individual files instead of having to use more complex YAML formatting.
Nested objects and lists are split into their own files for modularity and clarity.

| Simple Data Types  | Complex Data Types |
| ------------------ | ------------------ |
| String w/o Newline: `"Hello World"`  |  Multi-line String |
| Number: `3.14`, `42`  | List |
| Boolean: `true`, `false` | Object|
| Null: `null` | |
| Empty String: `''` | |
| Empty List: `[]` | |
| Empty Object: `{}` | |

## Mapping Complex Data Types to Files

### Multi-line Strings
TODO

### Lists
listname.yaml

### Objects
model/_this.yaml

## References to Subfiles
(())

## List Element IDs
TODO

# CRUD Operations
First we will discuss how each CRUD operation maps onto the library functions, then we will discuss use cases by function.

* Create 
  * Store
* Read 
  * Load
* Update  
  * TBD
* Delete
  * Delete
  * Clear

## Store Use Cases

This section provides an explanation for each identified use case in the YAML Datastore specification. For each use case we provide an example data structure along with its representation on disk and an explanation of why that is the representation. All of these use cases are of a element (an object or a list) named model.

TODO: wordsmith above

<!-- include (test/spec/1.1_object_with_simple_data_types/README.md) -->
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
#### Generated Directory Structure
The generated data structure for this example starts with a directory named `model` to represent the object above named "model". All objects will contain `_this.yaml` file in this directory. For this case, that is the only file present because we can store all of the properties in a single line. 
```txt
model
└── _this.yaml
```
#### Generated Files
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
<!-- /include -->

<!-- include (test/spec/1.2.1_object_with_complex_string/README.md) -->
### Object with Complex String
This use case demonstrates storing an object that contains a complex string.
#### The Model to Store
In this case, `lyrics_txt` contains a multi-line string. Because the key will reference a text file, the convention `_txt` to represents `.txt`.
```json
{
  "songTitle": "Mary Had a Little Lamb",
  "album": "Classic Childrens Songs 2",
  "track": 17,
  "lyrics_txt": "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go."
}
```
#### Generated Directory Structure
As with all objects, the generated data structure for this example starts with a directory named `model` and the file `_this.yaml`.
```txt
model
├── lyrics.txt
└── _this.yaml
```
#### Generated Files
##### `model/_this.yaml`
In this file, we use the convention of enclosing the filename in double parentheses, `((lyrics.txt))` to reference the file storing the data.
```yaml
songTitle: Mary Had a Little Lamb
album: Classic Childrens Songs 2
track: 17
lyrics_txt: ((lyrics.txt))
```
##### `model/lyrics.txt`
This text file stores the data for the multi-line string. 
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
<!-- /include -->

<!-- include (test/spec/1.2.2_object_with_object_of_simple_data_types/README.md) -->
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
#### Generated Directory Structure
As with all objects, the generated data structure for this example starts with a directory named `model` and the file `_this.yaml`. Because this object contains an object, there is now a sub-directory named `address` named after the object and contains its own `_this.yaml` file.
```txt
model
├── address
│   └── _this.yaml
└── _this.yaml
```
#### Generated Files
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
<!-- /include -->

<!-- include (test/spec/1.2.3_object_with_object_of_complex_data_types/README.md) -->
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
<!-- /include -->

<!-- include (test/spec/1.2.4_object_with_list_of_simple_data_type/README.md) -->
### Object with List of Simple Data Type
#### The Model to Store
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
#### Generated Directory Structure
```txt
model
├── employees.yaml
└── _this.yaml
```
#### Generated Files
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
<!-- /include -->

<!-- include (test/spec/1.2.5_object_with_list_of_simple_data_types/README.md) -->
### Object with List of Simple Data Types
#### The Model to Store
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
#### Generated Directory Structure
```txt
model
├── personInfo.yaml
└── _this.yaml
```
#### Generated Files
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
<!-- /include -->

<!-- include (test/spec/1.2.6_object_with_list_of_complex_strings/README.md) -->
### Object with List of Complex Strings
#### The Model to Store
```json
{
  "songTitle": "Mary Had a Little Lamb",
  "album": "Classic Childrens Songs 2",
  "track": 17,
  "verses_txt": [
    "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go.", 
    "He followed her to school one day\nWhich was against the rule;\nIt made the children laugh and play,\nTo see a lamb at school.", 
    "And so the teacher turned him out,\nBut still he lingered near;\nAnd waited patiently about\nTill Mary did appear", 
    "\"What makes the lamb love Mary so?\""
  ]
}
```
#### Generated Directory Structure
```txt
model
├── _this.yaml
├── verses_506E59.txt
├── verses_A28836.txt
├── verses_E16F4F.txt
└── verses_txt.yaml
```
#### Generated Files
##### `model/_this.yaml`
```yaml
songTitle: Mary Had a Little Lamb
album: Classic Childrens Songs 2
track: 17
verses_txt: ((verses_txt.yaml))
```
##### `model/verses_txt.yaml`
```yaml
- ((verses_E16F4F.txt))
- ((verses_506E59.txt))
- ((verses_A28836.txt))
- '"What makes the lamb love Mary so?"'
```
##### `model/verses_506E59.txt`
```txt
He followed her to school one day
Which was against the rule;
It made the children laugh and play,
To see a lamb at school.
```
##### `model/verses_A28836.txt`
```txt
And so the teacher turned him out,
But still he lingered near;
And waited patiently about
Till Mary did appear
```
##### `model/verses_E16F4F.txt`
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
<!-- /include -->

<!-- include (test/spec/1.2.7.1_object_with_list_of_objects_of_simple_data_types/README.md) -->
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
<!-- /include -->

<!-- include (test/spec/1.2.7.2_object_with_list_of_list_of_simple_data_type/README.md) -->
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
<!-- /include -->

<!-- include (docs/README.md) -->
# API v0.0.0

## Classes

- [LoadResult](classes/LoadResult.md)
- [StoreResult](classes/StoreResult.md)

## Functions

- [generateIDs](functions/generateIDs.md)
- [load](functions/load.md)
- [store](functions/store.md)
<!-- /include -->

# License
Mach30/yaml-datastore is licensed under the [Apache 2.0 License](https://github.com/Mach30/yaml-datastore/blob/main/LICENSE).

# Contributions
Include information about developer documentation, contribution policy and community chat boards

