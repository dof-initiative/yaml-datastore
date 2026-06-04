![Bart Simpson in front of chalkboard writing repeatedly "GIT IS NOT A DATABASE"](./bartsimpsonmeme.png)
<br>
**Git is not a database.—but what if it was?** With YAML datastore, you can make your data Git-friendly.

YAML Datastore is a lightweight library that stores and manages data with structured plaintext files and YAML syntax, designed for use with version control systems. This enables you to gain the advantages of Git for your data—track changes at the feature level, store data across multiple systems, and merge data seamlessly.
<br>

**Getting Started**

- New to YAML Data Store? Get [introduced](#introduction)
- Ready to install? Follow the [installation steps](#installation)
- Learn how it works in [About YAML Datastore Library](#about-yaml-datastore-library)
- Want to use the API? See [the API documentation](#api-v000)

<br>

**Contents**

<!-- !toc (numbered) -->

1\. [Introduction](#introduction) <br>
1.1\. [What is YAML Datastore?](#what-is-yaml-datastore) <br>
1.2\. [Purpose of YAML Datastore](#purpose-of-yaml-datastore) <br>
2\. [Installation](#installation) <br>
3\. [About YAML Datastore Library](#about-yaml-datastore-library) <br>
3.1\. [Element Paths](#element-paths) <br>
3.1.1\. [Cases of Element Paths](#cases-of-element-paths) <br>
3.2\. [Supported Data Types](#supported-data-types) <br>
3.3\. [Mapping Complex Data Types to Files](#mapping-complex-data-types-to-files) <br>
3.3.1\. [Complex Strings](#complex-strings) <br>
3.3.2\. [Lists](#lists) <br>
3.3.3\. [Objects](#objects) <br>
3.4\. [References to Subfiles](#references-to-subfiles) <br>
3.5\. [About List Element IDs](#about-list-element-ids) <br>
3.5.1\. [Reasons for using List Element IDs](#reasons-for-using-list-element-ids) <br>
3.5.2\. [Implementation and Format](#implementation-and-format) <br>
3.6\. [CRUD Operations](#crud-operations) <br>
3.6.1\. [Store Function](#store-function) <br>
3.6.2\. [Load Function](#load-function) <br>
3.6.3\. [Delete Function](#delete-function) <br>
3.6.4\. [Clear Function](#clear-function) <br>
4\. [Use Cases](#use-cases) <br>
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

YAML Datastore exists because rather than try to add Git-like features to how we store and manage data, we want to do data management in a way that fits in Git. We found that existing systems attempting to use Git as a backend didn't account properly for structure. YAML Datastore automatically manages this structure with easy to understand rules that we explain in About [YAML Datastore Library](#about-yaml-datastore-library). 

# Installation

Install the library in the root directory of your project using npm or yarn.

`npm install yaml-datastore`

`yarn add yaml-datastore`

# About YAML Datastore Library

This section provides comprehensive details about how the YAML Datastore library organizes and stores data on disk.

YAML Datastore implements the standard CRUD operations for transforming in-memory objects and lists into structured YAML files and back. We will describe how locations [map](#element-paths) onto the file system with file and element paths, the [supported data types](#supported-data-types), and provide a comprehensive list of example [use cases](#use-cases). The information about [list IDs](#about-list-element-ids) is particularly relevent for those who want to implement YAML Datastore using their tools of choice.

## Element Paths

YAML Datastore defines two types of locations. The first type is the **file path**, where data lives on disk. For example, the file path for the numeric property `pi: 3.14` that is part of the constants object `model/constants/_this.yaml` (the value pi will be included in the file). The second type is the **element path**, where data lives in the in-memory model. Continuing from the previous example, the element path for pi would be `model.constants.pi`. Element paths can also include list notations, such as `mylist[2]`, `model.info.mylist[2]`, `model.mylist[3][1]`.

A **file path** follows standard filesystem conventions, a hierarchy of directories plus a single terminal file, as seen in the example for the filepath to pi, `model/constants/_this.yaml`.

An **element path** is an object path, expressed in dot and brackets notation, from the working directory to the element to be read into memory. 

For example, let's say we have a list of Avengers stored as objects that are a list of simple data types, i.e. their name and age.

<!-- include (test/spec/1.2.7.1_object_with_list_of_objects_of_simple_data_types/model.json lang=json) -->
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
<!-- /include -->

Say we want to retrieve the first name of Captian America, `Steve`. When the current working directory _contains_ the model directory, we'd use `model.avengers[0].firstName`. When the current working directory _is_ the model directory, we'd use `avengers[0].firstName`. 

<!-- include (test/spec/1.2.7.1_object_with_list_of_objects_of_simple_data_types/default/.model_tree.txt lang=txt) -->
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
<!-- /include -->

 The above directory shows how the library maintains a mapping between element space and file system space, separating the content out into files.

 All API calls use element paths; the library handles translation to and from file paths internally.

### Cases of Element Paths

Element paths can be empty, short, or hierarchical. 

**Empty** element paths must refer to an *object* stored in the current working directory. Essentially, the current working directory must have a `\_this.yaml` in it, otherwise the element path is invalid. *This is the only valid case for an empty element path; it cannot point to any other data type.*

**Short** element paths may refer to an object, a list, a complex string, or a simple value. They contain no hierarchy and use a single identifier with no dots or brackets (e.g. `model`, `avengers`, `firstName`). 
These four examples will help clarify how short element paths are used based on the current working directory:
* If it _contains_ `model/`, the short path to the element is `model`. 
* If it _is_ `model/`, the short path to the list of Avengers is `avengers`. 
* If it is `model/avengers_E16F4F/`, the short paths to individual fields are `firstName` or `lastName`. 
* If it is an object and the object owns a property `Steve`, you would use short path `firstName`, or for `Rogers`, `lastName`. 

Edge Case: When current working directory is `model/` and contains a list of complex data types, the data types can be accessed using a short path to the complex data. 

**Hierarchical** element paths are multi-step and use dots for object properties and brackets for list indices (e.g. `model.avengers[0].firstName`). 
Examples:
* If it _contains_ `model/` and you want to access `Steve`, the hiearchial path is `model.avengers[0].firstName` 
* If it _is_ `model/`, the hierarchial path is `avengers[0].firstName`. Note: to access all information about captain america, the hiearchial path is `avengers[0]`

## Supported Data Types

YAML Datastore supports any data types that are supported in YAML (and JSON). YAML Datastore categorizes these data types as simple or complex based upon their representation inside of a YAML file containing that data before serialization. The element that this YAML file represents is referred to as the root element. A root element can either be an object (root object) or a list (root list).

Simple data types can be represented as a single line in a YAML file. This includes all scalar types; scalar types in YAML are strings without newlines, numbers, booleans, or nulls. Empty lists and empty objects are also simple data types. Empty strings without new lines are a simple data type.

Complex data types require more than one line to be represented as a YAML file. This includes complex strings and (non-empty) lists and objects. Empty strings with new lines are a complex data type. Complex data types are serialized into individual files. Lists and objects may have child elements that are simple or complex data types. How parent lists and objects reference complex data types will be covered in [Mapping Complex Data Types to Files](#mapping-complex-data-types-to-files).

| Simple Data Types                   | Complex Data Types              |
| ----------------------------------- | ------------------------------- |
| String w/o Newline: `"Hello World"` | Complex String                  |
| Number: `3.14`, `42`                | List                            |
| Boolean: `true`, `false`            | Object                          |
| Null: `null`                        |                                 |
| Empty String: `''`                  | Empty String w/ Newline: `'\n'` |
| Empty List: `[]`                    |                                 |
| Empty Object: `{}`                  |                                 |

## Mapping Complex Data Types to Files

This section describes each of the complex data types and the method used to serialize them to disk.

### Complex Strings

Complex strings are serialized to disk as text files. Complex strings will either have an object or list as a parent. For objects, the text files are a sibling of the parent element's `_this.yaml` file. For lists, the text files are a sibling of the parent element's yaml file. The parent file [references](#references-to-subfiles) such files using a convention described in the next section.

### Lists

Lists are serialized to disk as yaml files. A root list file lives directly in the working directory. If list is the child of a parent list or object, the list will require its own file which will be [referenced](#references-to-subfiles) in the parent using a convention described in the next section. If the parent is an object, the list will be named after the key\*. If the parent is a list, list elements require unique names which are generated using a process described in [List Element IDs](#list-element-ids).

- If key name includes an underscore `_`, this will be changed to a dot separator `.`.

### Objects

Objects are serialized to disk with a directory and a file `_this.yaml` containing the information. The root object's directory and file contents lives in the working directory. If the object is a child of a parent list or object, the object will require its own directory containing its own `_this.yaml` file, and the parent will [reference](#references-to-subfiles) the object using the convention described in the next section. When the object is the child of an object, the directory is nested in its parent object's directory and be named after the key\*. When the object is the child of a list, the object's directory will require a unique name which is generated using a process described in [List Element IDs](#list-element-ids).

## References to Subfiles

To point to the files storing complex data, we use the convention of enclosing the relative filepath in double parentheses `((` `))`. For objects, any underscores `_` are replaced with dot separator `.`. For example `stringname_txt` becomes `((stringname.txt))`.

## About List Element IDs

To keep files stable, conflict-free, and diff-friendly in distributed environments, we generate IDs for list elements of complex data types using a seeded Xorshift Random Number Generator (RNG). This approach avoids issues that could arise from using traditional identifiers like UUIDs, GUIDs, short ids, or math.random() which could add "noise" into commits.

### Reasons for using List Element IDs

1. **Deterministic reproducibility**: By using a seeded RNG, the sequence of random numbers is always the same. If you generate a list of 10 items, delete them all, and then re-add the exact same 10 items, the resulting directory IDs will be identical to the first run. Your local filesystem doesn't "drift" or accumulate entropy over time; it remains a stable, predictable reflection of the current data state.
2. **Conflict-free merging**: By using a seeded RNG, the sequence of random numbers is the same across different environments. If two users independently add _identical_ data to a list, the resulting directory IDs remain consistent. When merging branches in Git, these "overlapping" files resolve naturally without manual intervention.
3. **Meaningful Diffs**: Filesystem changes only reflect the actual data updates. Metadata noise, such as timestamps or environment-specific IDs are avoided, providing a clean version control history. If you swap the positions of two items in a list, the Git diff will show only the reordering of the references in the list.yaml file.
4. **A-Chronological logic**: IDs are non-sequential by design. The filesystem doesn't imply a "rank" or "order" that doesn't exist in the data structure.
5. **Lightweight**: Since JS doesn't include a seeded RNG, YAML datastore has to include a third-party RNG library. We selected pure-rand for its standards compliant implementation and the fact that it has zero run-time dependencies.

### Implementation and Format

To ensure cross-implementation consistency, all implementations need to use the same seed value.

The selected seed value is the integer `321`, which is the sum of the ASCII decimal codes for the string "OSHW" (79 + 83 + 72 + 87 = 321).

Each ID is 6 uppercase hexadecimal digits (characters 0–9, A–F), maximizing the namespace while keeping directory names short and human-readable.

A per-list counter (`idCounter`) tracks the total number of IDs ever generated for a given list, stored in a hidden dot-file named after the list (e.g. `.model.yaml`). When a new ID is needed, the RNG is seeded at 321 and advanced idCounter steps; that value becomes the new ID and the counter increments by one. The absence of the dot-file is equivalent to a counter value of zero. The generator state needs to reset to this seed after every use. This ensures that the ID for an item depends only on the algorithm, not the order in which items were added or how many exist in the list. _TODO: skip mechanism_

IDs are appended to the parent element name with an underscore `_` separator, followed by a suffix identifying the complex data type (`_this.yaml` for objects, `.yaml` for lists, `.txt` for complex strings). Nesting is reflected by chaining IDs with underscores, for example `model_E16F4F_506E59.yaml`.

**start notes**
Show id is 6 uppercase hex digits long and show what we do with the IDs -- we append the end of a parent name \_ id name for whatever the class of thing is that's complex - object, list, complex string - and this nests and the ids nest with underscores in the name. use spec directory.
**end notes**

## CRUD Operations

We will discuss how each CRUD operation maps onto the library functions and use cases by function.
Todo: expressing iterative loading

| CRUD Operation | Library Function | Parameters                                                              |
| -------------- | ---------------- | ----------------------------------------------------------------------- |
| Create         | Store            | `element: object, workingDirectoryPath: string, elementName: string`    |
| Read           | Load             | `workingDirectoryPath: string, elementPath: string, depth: number = -1` |
| Update         | TBD              | TBD                                                                     |
| Delete         | Delete           | `workingDirectoryPath: string, elementPath: string, depth: number = 0`  |
|                | Clear            | `workingDirectoryPath: string, elementPath: string, depth: number = 0`  |

TODO: note about element: object; arrays in TypeScript are objects

### Store Function

The Store function serializes in-memory data structures onto the filesystem, mapping each data type to its corresponding file or directory representation. It takes an object or list element as an input.

#### Element is object

- Creates a directory named with the element name in the working directory path.
- Generates a `_this.yaml` file inside that directory to hold the object's properties.
- For every property in the object that are objects or list, Store is called recursively. Simple types are written to `_this.yaml` , while complex types are included as references.

#### Element is list

- Creates a .yaml file named with the element name in the working directory path.
- For every item in the list that are objects or list, Store is called recursively and generates an ID.
- `idCounter`, in a hidden `.` (dot) file named after the yaml list (e.g., `.model.yaml`) that increments. Absense of file means list counter value is 0 (zero).

### Load Function

The Load function reconstructs disk data back into the in-memory data structure and resolves filesystem [references](#references-to-subfiles) e.g. `((``))`. The depth to load the object tree is specfied as a parameter, the default depth is -1. The Load Function takes as input the working directory, element path, and depth. Here is the expected behavior for different types of element paths.

#### Empty Element Path

- Must point to an Object. An empty path indicates the root of the current working directory.
- The function checks the working directory for a `_this.yaml` file.
- If `_this.yaml` is missing, the function throws an error, as a directory without this file is not a valid object root in this spec.

#### Short Element Path

- A single-level identifier (no dots or brackets). The behavior is determined by the file extension found at that path.

##### Element path points at Object

- The library loads the contents of [path]/\_this.yaml

##### Element path points at List

- [path].yaml file. The library loads the array

##### Element path points at Complex String

- The library loads the [path].txt file, preserving newlines that would otherwise break standard YAML formatting.

##### Element path points at Simple Value

- The value is read directly from the parent YAML file.

#### Hiearchial Element Path

A multi-step path (e.g., `model.assemblySteps[0].summary`). The library recursively traverses the filesystem, resolving each segment until it reaches the target.

Example: `model.assemblySteps` might return a list of references: `[ "((step_E16F4F))", "((step_506E59))" ]`.

##### Element path points at simple value

- Returns the final scalar value found in the terminal YAML file.

Example: `model.assemblySteps[0].summary` resolves through the list, into the specific step's \_this.yaml, and returns the string stored under the summary key.

### Delete Function

The Delete function permanently removes an element from the data structure. It modifies the parent (object or list) to excise the reference and deletes the corresponding files or directories from the filesystem. (e.g., if `model.foo` points to a string, "bar", "delete" operation removes `model.foo` entirely)

#### Empty Element Path

- Error - Cannot delete directory while inside

#### Short Element Path

- The behavior is determined by the "owning" structure (the CWD).
- **If Parent is an Object**: The key is removed from the \_this.yaml file. If the value was a complex type, its associated subdirectory or file (e.g., model/ or model.txt) is deleted from the disk.
- **If Parent is a List**: The index is removed from the [list].yaml file. The associated generated ID directory is deleted. Note that this shifts the indices of all subsequent items in the list, but does not reset the idCounter.
- Clearing a list removes its expanded file representation but does not reset the idCounter. This ensures that subsequent additions to the list continue the unique ID sequence, preventing collisions with previously existing (or cleared) elements.

#### Hiearchial Element Path
TODO

### Clear Function

The Clear function removes the expanded filesystem representation of a complex data type without removing the element itself from the parent model. e.g., if `model.foo` points to a string, "bar", "clear" operation "removes" contents of `model.foo`, but `model.foo` itself still exists.

#### Empty Element Path

- Similar to the Delete function, you cannot clear the root directory from within itself.
- An empty path always implies an Object (the current directory). Clearing it would require moving to the parent context and targeting this directory by name.

#### Short Element Path

- The function first performs an internal check to see if the element is already cleared.
- Complex Data Types: If the element contains a reference (e.g., `((model.txt))`), the function deletes that file/directory from the disk. The reference string remains in the parent YAML, but it now points to a non-existent (cleared) resource.
- Simple Data Types: Since simple values (numbers, booleans, simple strings) exist only as inline data in the parent YAML, "clearing" them has no effect on the filesystem. The function returns success with no changes.
- Clearing a list removes its expanded file representation but does not reset the idCounter.

#### Hiearchial Element Path
TODO

# Use Cases

This section provides an explanation for each identified use case in the YAML Datastore specification. For each use case we provide an example data structure along with its representation on disk and an explanation of why that is the representation. All of these use cases are of a element (an object or a list) named model.

## Store Use Cases

{Intro}

TODO: wordsmith above

<!-- include (test/spec/1.1_object_with_simple_data_types/default/README.md) -->
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
<!-- /include -->

<!-- include (test/spec/1.2.1_object_with_complex_string/default/README.md) -->
### Object with Complex String
This use case demonstrates storing an object that contains a complex string.
#### The Model to Store
In this case, `lyrics_txt` contains a multi-line string. Because the key will reference a text file, the convention `_txt` maps to `.txt`.
```json
{
  "songTitle": "Mary Had a Little Lamb",
  "album": "Classic Childrens Songs 2",
  "track": 17,
  "lyrics_txt": "Mary had a little lamb,\nIt's fleece was white as snow;\nAnd everywhere that Mary went\nThe lamb was sure to go."
}
```
#### Resulting Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties.
```txt
model
├── lyrics.txt
└── _this.yaml
```
#### Contents of the Files
##### `model/_this.yaml`
The first three properties in this file are simple data, and thus in one line. The fourth property, `lyrics_txt`, is a complex string, therefore we use the convention of enclosing the filename where the string contents will be stored in double parentheses, `((lyrics.txt))`.
```yaml
songTitle: Mary Had a Little Lamb
album: Classic Childrens Songs 2
track: 17
lyrics_txt: ((lyrics.txt))
```
##### `model/lyrics.txt`
This text file stores the data for the multi-line string that was stored in `lyrics_txt`.
```txt
Mary had a little lamb,
It's fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.
```
<!-- /include -->

<!-- include (test/spec/1.2.2_object_with_object_of_simple_data_types/default/README.md) -->
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
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this object contains an object, it also has a sub-directory named `address` named after the key that contains `address`'s properties in its own `_this.yaml` file.
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
<!-- /include -->

<!-- include (test/spec/1.2.3_object_with_object_of_complex_data_types/default/README.md) -->
### Object with Object of Complex Data Types
This use case demonstrates storing an object that contains an object with complex data.
#### The Model to Store
In this case, the model contains an object `myObj` with a nested object `personInfo`, a multi-line string `lyrics_txt`, and a list `primeNumbers`. 
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
#### Resulting Directory Structure
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. The `model/_this.yaml` contains the key `myObj` and the relative filepath using the double parentheses convention `((myObj/_this.yaml))` because this object contains complex data.
Because `myObj` contains complex data, it needs its own directory also includes additional files and directories. The `myObj/_this.yaml` file references the relative filepaths using the double parentheses convention: `((lyrics.txt))`, `((personInfo/_this.yaml))`, and `((primeNumbers.yaml))`. 
* The nested object results in a sub-directory named `personInfo` containing its properties in a `_this.yaml` file. 
* The multi-line string results in a text file named `lyrics.txt` containing the string content in the `myObj` directory. 
* The list results in a yaml file named `primeNumbers.yaml` in the `myObj` directory.
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
#### Contents of the Files
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

<!-- include (test/spec/1.2.4_object_with_list_of_simple_data_type/default/README.md) -->
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
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. The `model/_this.yaml` directly contains the simple data `companyName` and `foundedYear`, but the list `employees` requires creating the `employees.yaml` file. So the relative filepath is referenced using the double parentheses convention `((employees.yaml))`. Since this list contains only simple data types, all its properties can be stored directly in yaml file. 
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
<!-- /include -->

<!-- include (test/spec/1.2.5_object_with_list_of_simple_data_types/default/README.md) -->
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
<!-- /include -->

<!-- include (test/spec/1.2.6_object_with_list_of_complex_strings/default/README.md) -->
### Object with List of Complex Strings
#### The Model to Store
In this case we have an object that contains a list `verses_txt` containing one string and three multi-line strings.
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
Because it is an object, the data structure for this example has a directory named `model` to represent the object above named "model" that contains a `_this.yaml` file to store the object's properties. Because this property is a list, `model/_this.yaml` references the relative filepath of the list using the double-parentheses convention `((verses_txt.yaml))`. 
Because the list contains simple data and multi-line strings, the simple data can be included directly, but text files must be generated for each of multi-line strings To ensure proper storage, each text file receives a unique 6 digit ID. The relative filepath to these text files is stored in the yaml file using the double parentheses convention `((verses_E16F4F.txt))`, `((verses_506E59.txt))`, and `((verses_A28836.txt))`.
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

<!-- include (test/spec/1.2.7.1_object_with_list_of_objects_of_simple_data_types/default/README.md) -->
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

<!-- include (test/spec/1.2.7.2_object_with_list_of_list_of_simple_data_type/default/README.md) -->
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

- [YdsResult](classes/YdsResult.md)

## Functions

- [clear](functions/clear.md)
- [deleteElement](functions/deleteElement.md)
- [generateIDs](functions/generateIDs.md)
- [load](functions/load.md)
- [store](functions/store.md)
<!-- /include -->

# License

Mach30/yaml-datastore is licensed under the [Apache 2.0 License](https://github.com/Mach30/yaml-datastore/blob/main/LICENSE).

# Contributions

Include information about developer documentation, contribution policy and community chat boards

