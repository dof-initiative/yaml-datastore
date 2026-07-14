[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / load

# Function: load()

> **load**(`workingDirectoryPath`, `elementPath`, `depth`): [`YdsResult`](../classes/YdsResult.md)

Defined in: [load.ts:77](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/load.ts#L77)

Returns a in-memory representation of the element in working directory specified by element path

## Parameters

### workingDirectoryPath

`string`

relative or absolute path to working directory containing yaml-datastore serialized content

### elementPath

`string`

object path (dot separated, with support for bracketed indexing for list elements or key-value pairs in objects) from working directory to element to be read into memory (e.g., top-element.sub-element.property[3])

### depth

`number` = `-1`

integer from -1 to depth of element indicating how deep into element's hierachy to read into memory (-1 = read full depth. Defaults to -1), will not throw error if depth exceeds actual maximum depth of element

## Returns

[`YdsResult`](../classes/YdsResult.md)

a YdsResult containing the status and content of the load function
