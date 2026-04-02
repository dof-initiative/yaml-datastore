[yaml-datastore](../README.md) / load

# Function: load()

```ts
function load(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): LoadResult;
```

Defined in: [load.ts:417](https://github.com/dof-initiative/yaml-datastore/blob/614c3712e115e664cb58107b5453c8c7d6fad865/src/load.ts#L417)

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

[`LoadResult`](../classes/LoadResult.md)

a LoadResult containing the status and content of the load function
