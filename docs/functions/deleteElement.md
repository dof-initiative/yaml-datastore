[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / deleteElement

# Function: deleteElement()

> **deleteElement**(`workingDirectoryPath`, `elementPath`, `depth`): [`YdsResult`](../classes/YdsResult.md)

Defined in: [delete.ts:89](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/delete.ts#L89)

## Parameters

### workingDirectoryPath

`string`

relative or absolute path to working directory containing yaml-datastore serialized content

### elementPath

`string`

element path to element to be deleted

### depth

`number` = `0`

depth of element to be returned in YdsResult object

## Returns

[`YdsResult`](../classes/YdsResult.md)

a YdsResult containing the status of the call to deleteElement function
