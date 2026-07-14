[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / store

# Function: store()

> **store**(`element`, `workingDirectoryPath`, `elementName`): [`YdsResult`](../classes/YdsResult.md)

Defined in: [store.ts:300](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/store.ts#L300)

Dumps in-memory representation of contents to on-disk representation

## Parameters

### element

`object`

object or list to store on-disk

### workingDirectoryPath

`string`

relative or absolute path to an empty working directory to store element in

### elementName

`string`

name of element to store

## Returns

[`YdsResult`](../classes/YdsResult.md)

a YdsResult containing the status of the call to store function
