[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / clear

# Function: clear()

> **clear**(`workingDirectoryPath`, `elementPath`, `depth`): [`YdsResult`](../classes/YdsResult.md)

Defined in: [clear.ts:22](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/clear.ts#L22)

## Parameters

### workingDirectoryPath

`string`

relative or absolute path to working directory containing yaml-datastore serialized content

### elementPath

`string`

element path to element to be cleared

### depth

`number` = `0`

depth of element to be returned in YdsResult object

## Returns

[`YdsResult`](../classes/YdsResult.md)

a YdsResult containing the status of the call to clear function
