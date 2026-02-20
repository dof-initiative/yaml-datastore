# spec

temporary list of specs in markdown

## data types

### simple

- strings (without new lines)
- numbers
- booleans
- null
- empty object
- empty list

### complex

- objects
- lists
- strings (with new lines)

### full list of supported types

- simple strings
- numbers
- booleans
- null
- complex strings
- objects
- lists

## top-level entities

- object
- list

### objects

- 1.1_object_with_simple_data_types: all contents are simple
- 1.2_object_with_complex_data_type
  - 1.2.1_object_with_complex_string
  - 1.2.2_object_with_object_of_simple_data_types
  - 1.2.3_object_with_object_of_complex_data_types
  - 1.2.4_object_with_list_of_simple_data_type
  - 1.2.5_object_with_list_of_simple_data_types
  - 1.2.6_object_with_list_of_complex_strings
  - 1.2.7_object_with_list_of_complex_data_types
    - 1.2.7.1_object_with_list_of_objects_of_simple_data_types
    - 1.2.7.2_object_with_list_of_list_of_simple_data_type
- 1.3_object_with_complex_data_types
  - 1.3.1_object_with_two_complex_strings
  - 1.3.2_object_with_two_objects_of_simple_data_types
  - 1.3.3_object_with_two_objects_of_complex_data_types
  - 1.3.4_object_with_two_lists_of_simple_data_type
  - 1.3.5_object_with_two_lists_of_simple_data_types
  - 1.3.6_object_with_two_lists_of_complex_strings
  - 1.3.7_object_with_two_lists_of_complex_data_types
    - 1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types
    - 1.3.7.2_object_with_two_lists_of_list_of_simple_data_type
- 1.4_object_with_empty_elements
  - 1.4.1_object_with_empty_object
  - 1.4.2_object_with_empty_list

### lists

- 2.1_list_of_simple_data_types: all contents are simple
- 2.2_list_of_complex_data_type
  - 2.2.1_list_of_complex_string
  - 2.2.2_list_of_objects_of_simple_data_types
  - 2.2.3_list_of_objects_of_complex_data_types
  - 2.2.4_list_of_list_of_simple_data_type
  - 2.2.5_list_of_list_of_simple_data_types
  - 2.2.6_list_of_list_of_complex_strings
  - 2.2.7_list_of_list_of_complex_data_types
    - 2.2.7.1_list_of_list_of_objects_of_simple_data_types
    - 2.2.7.2_list_of_list_of_list_of_simple_data_type
- 2.3_list_with_empty_elements
  - 2.3.1_list_with_empty_object
  - 2.3.2_list_with_empty_list

### representative objects

- 3.1_legacy_project

## elementPath meanings

yaml-datastore, from an API perspective, "talks" in terms of element path.

| Case name                                    | elementPath  | object interpretation                      | list interpretation                        | complex string interpretation              | simple value interpretation          | comments                                                  |
| -------------------------------------------- | ------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------ | --------------------------------------------------------- |
| empty element path                           |              | `load("_this.yaml")`                       | N/A                                        | N/A                                        | N/A                                  | should error if no `_this.yaml` exists                    |
| simple element path                          | model        | `load("model/_this.yaml")`                 | `load("model.yaml")`                       | `load(load("_this.yaml").model)`           | `load("_this.yaml").model`           | need to verify file path to complex string content exists |
| object property element path                 | model.foo    | `load(load("model/_this.yaml")["foo"])`    | `load(load("model/_this.yaml")["foo"])`    | `load(load("model/_this.yaml")["foo"])`    | `load("model/_this.yaml")["foo"]`    |                                                           |
| list item of an object property element path | model.foo[1] | `load(load("model/_this.yaml")["foo"][1])` | `load(load("model/_this.yaml")["foo"][1])` | `load(load("model/_this.yaml")["foo"][1])` | `load("model/_this.yaml")["foo"][1]` | should error if no `_this.yaml` exists                    |
| list item element path                       | model[1]     | `load(load("model.yaml")[1])`              | `load(load("model.yaml")[1])`              | `load(load("model.yaml")[1])`              | `load("model.yaml")[1]`              |                                                           |
| object property of a list item element path  | model[1].foo | `load(load(load("model.yaml")[1])["foo"])` | `load(load(load("model.yaml")[1])["foo"])` | `load(load(load("model.yaml")[1])["foo"])` | `load(load("model.yaml")[1])["foo"]` | `model[1]` must be an object, error otherwise             |
| list item of a list item element path        | model[1][5]  | `load(load(load("model.yaml")[1])[5])`     | `load(load(load("model.yaml")[1])[5])`     | `load(load(load("model.yaml")[1])[5])`     | `load(load("model.yaml")[1])[5]`     | `model[1]` must be a list, error otherwise                |

### notes

test/spec/3.1_legacy_project/ | model.assemblySteps[0].summary | load(load(load("model/\_this.yaml")["assemblySteps"])[0])["summary"]

- model/\_this.yaml
- ["assemblySteps"] -> assemblySteps.yaml
- [0] -> assemblySteps_E16F4F/\_this.yaml

- get 1st entry of elementPath and load 0-depth load of that elementPath
- take next piece of elementPath and access its contents at given location
- if contents accessed requires loading, then perform 0-depth load of that elementPath
- take next piece of elementPath and access its contents... bc thing (if property) is in contents of last filepath, unless it's an object, list, or file.

ergo...

- when empty elementPath only 1 case, cwd is an object
- when simple elementPath, 4 conditions to test, (obj, list, complex string/simple value)
- everything else is one of two cases,
  - elementPath points to a complex object (i.e., object, list, complex string)
  - elementPath points at a simple property

observation: latter two cases are either dot separated or bracketed

- find first element entry path, e.g., model
- find list of remaining entry path elements, e.g., myList = ["assemblySteps", "0", "summary"]
- temp = model | file path: model/\_this.yaml
- temp = temp[myList[0]] | file path: assemblySteps.yaml
- temp = temp[myList[1]] | file path: assemblySteps_E16F4F/\_this.yaml
- temp = temp[myList[2]] | accesses "summary"

model/assemblySteps_E16F4F/\_this.yaml

## delete and clear notes

"delete" is removal of the element from the model (e.g., if `model.foo` points to a string, "bar", "delete" operation removes `model.foo` from existence).

"clear" is removal of the element contents from the model, but not element itself (e.g., if `model.foo` points to a string, "bar", "clear" operation "removes" contents of `model.foo`, but `model.foo` itself still exists).

What it means to remove contents:

- removing contents is something that only affects complex data types
- "remove contents" function deletes from disk what is pointed at in `(())` and all of its children
- e.g., removing filepath `((model/_this.yaml))` is equivalent of `rm -rf model/`

WIP: discuss "delete" and "clear" will behave differently depending on whether owning element is a list or object. TODO: handle remaining cases (lists, complex strings, etc.)

The subcases of "delete" and "clear" are:

- simple strings
- objects,
- lists
- complex strings
- other

Expected behavior for clearing a thing that is already clear:

- If a thing is already clear, there is no change on disk and result is `success`.
- Therefore we need a (internal) function that, given an element, tests whether a value is cleared.
- Potential implementation: check if element is already cleared. If element is not cleared, then clear element and return results. Else, return `success` with message indicating element is already cleared.

E16F4F
506E59
A28836
4B0D2F
7A1D77
B008AA
058F13
CE5CEF

lyrics_txt.yaml (initial state):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_A28836.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

Scenario 1: add a new entry at end of list, then delete lyrics_txt[2].
lyrics_txt.yaml (first transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_A28836.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
- ((lyrics_B008AA.txt))
```

lyrics_txt.yaml (second transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
- ((lyrics_B008AA.txt))
```

Scenario 2: First delete lyrics_txt[2], then add a new entry at end of list.
lyrics_txt.yaml (first transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

lyrics_txt.yaml (second transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
- ((lyrics_B008AA.txt))
```

Scenario 3: Delete lyrics_txt[2] and insert at lyrics_txt[2]

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

lyrics_txt.yaml (second transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_B008AA.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

Scenario 4: Insert at lyrics_txt[2] and delete lyrics_txt[3]

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_B008AA.txt))
- ((lyrics_A28836.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

lyrics_txt.yaml (second transformation):

```
- ((lyrics_E16F4F.txt))
- ((lyrics_506E59.txt))
- ((lyrics_B008AA.txt))
- ((lyrics_4B0D2F.txt))
- ((lyrics_7A1D77.txt))
```

NOTE: unlike relational databases that mark an item as "deleted" or "cleared", yaml-datastore will actually delete or clear the element.

delete and clear will need a shared helper function that takes a working directory and path to an element returns the elementpath to its parent.

things needed for writing test cases:

- json file representation of "before" state
- json file representation of "after" state
- directory structure that represents "after" state

general flow of test case:

- read into memory the "before" json file
- use store() to store "before" representation on disk
- perform delete/clear operation
- will get back "after" state representation
- load "after" state into memory
- assert string representations of "after" state
- assert "after" state directories written to disk match "after" state directories of spec including hash

### management of list id's

#### assumptions

- list of functions impacted by list id's
  - delete
  - clear
  - append (to the end of list)
  - insert (anywhere in the list)
  - resolveMergeConflict
- the selection for an id in an entry for a list should be a one-to-one and onto calculation
- id's are generated according to generateIDs() function - already possesses one-to-one and onto characteristics
- the order of operation should not change the result
  - e.g., adding a 3rd entry to a list should generate the 3rd id regardless of if the 2nd element is deleted before or after the 3rd element is added (see scenarios 1 & 2)
- project persists in a git repo

#### analysis

- content shall be stored in the filesytem
- content shall be tracked by git
  - content shall not rely on an empty directory as a state for tracking list id's
- results of tracking id's shall enable calculation of the number to skip argument in the generateIDs() function

#### alternative solutions

1. maintain on-disk a per-list counter of number of ids ever generated
   1. counter can only increase or be deleted
   2. simple to implement
   3. fast to calculate
   4. can this resolve merge conflicts?
   5. an absense of a list counter represents the state that 0 (zero) id's have been generated
2. move and clear contents of complex data type into an empty . (dot) file
   1. more intensive/complicated algorithm than solution no. 1
   2. value of solution no. 2 would come from it can address problem solution no. 1 can't (e.g., resolve merge conflicts?)
3. maintain a list of deleted id's on-disk
   1. would be a more complicated version of solution no. 1
   2. no reason to persue at present

#### deep dive analysis into solution no. 1

- append (to the end of list)
  - Q: given a list and a counter, do we have all information needed to append to the list?
  - scenario no. 1: counter is 5, when calling append operation would skip 5 and increment counter to 6, then delete index no. 2
  - scenario no. 2: counter is 5, when calling delete operation on index no. 2 (counter is still 5), then calling appending operation would skip 5 and increment to 6
- insert (anywhere in the list): because append is a specialized insert function, insert operations would yield same result
- delete: only modifies the counter when entire list is removed (i.e., resets to zero)
- clear: only modifies the counter when entire list is removed (i.e., resets to zero)
- resolveMergeConflict: always resetting counter to zero will work; see merge conflicts section

#### conclusions

Solution 1 implemented as property, `idCounter`, of type number in a . (dot) file named after yaml list (e.g., `.model.yaml`) that increments. Absense of file means list counter value is 0 (zero)

- file does not exist for an empty list
- file is deleted if the list is deleted
- file is deleted if the list is cleared

### delete cases

#### delete from object

- delete simple string from object:
  - delete key from object.
- delete other (simple data types) from object:
  - delete key from object.
- delete complex string from object:
  - (e.g., `model.foo` that points a file on disk) deletes file, then delete key from object.
  - delete contents from disk: `rm <complex-string-filepath>`
  - delete key from object.
- delete object from object:
  - delete contents from disk: `rm -rf <directory-representing-object on-disk>`.
  - delete object: remove key from owning object on-disk in `_this.yaml`.
- delete list from object:
  - do a search on each list item.
  - delete all contents containing search result name: `rm -rf <list-item-name>*`.
  - delete list itself, then
  - delete key from object.

#### delete from list

- delete simple string from list:
  - delete item at specified index from list.
- delete other (simple data types) from list:
  - delete item at specified index from list.
- delete complex string from list:
  - (e.g., `model[2]` that points a file on disk) deletes file, then delete item at specified index from list.
  - delete contents from disk: `rm <complex-string-filepath>`.
  - delete item at specified index from list.
- delete object from list:
  - delete contents from disk: `rm -rf <directory-representing-object on-disk>`.
  - delete object: delete item at specified index from list.
- delete list from list:
  - do a search on each list item.
  - delete all contents containing search result name: `rm -rf <list-item-name>*` (there could be nested ID's; i.e., the owned list contains complex data that could be recursive).
  - delete list itself, then
  - delete delete item at specified index from list.

### clear cases

#### clear from object

- clear simple string from object:
  - set key to empty string, `""`
- clear other (simple data types) from object:
  - set key to `null`
- clear complex string from object:
  - set contents on disk to string with newline, `'\n'`
- clear object from object:
  - delete contents from disk
  - set key to empty object: `{}` in owning object on-disk in `_this.yaml`
- clear list from object:
  - do a search on each list item.
  - delete all contents containing search result name: `rm -rf <list-item-name>*`.
  - delete list itself, then
  - set key to empty list, `[]` in owning object on-disk in `_this.yaml`

#### clear from list

- clear simple string from list:
  - set item at specified index to empty string, `""`
- clear other (simple data types) from list:
  - set item at specified index to `null`
- clear complex string from list:
  - delete contents from disk
  - set item at specified index to string with newline, `'\n'`
- clear object from list:
  - delete contents from disk
  - set item at specified index to empty object: `{}` in owning list on-disk in `<list-name>.yaml`
- clear list from list:
  - do a search on each list item.
  - delete all contents containing search result name: `rm -rf <list-item-name>*` (there could be nested ID's; i.e., the owned list contains complex data that could be recursive).
  - delete list itself, then
  - set item at specified index to empty list, `[]` in owning list on-disk in `<list-name>.yaml`

### merge conflicts

TODO: discuss merge conflict resolution, particularly resolving ID's

#### current design decisions

see https://github.com/Mach30/demo-yaml-datastore-project

- resolving a merge conflict will hard-reset the ID counter
- after resolving merge conflict, need to check for unlisted complex data on disk and report any found
- needs to be an additional command for user to specify what to do w/ each unlisted complex data (e.g., delete or insert at specified index)
- algorithm needs to preserve unlisted complex data 'til user decides what to do with it
- investigate in-memory js-object merge libraries
