[yaml-datastore](../README.md) / clear

# Function: clear()

```ts
function clear(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [clear.ts:22](https://github.com/dof-initiative/yaml-datastore/blob/08f7a7f576b37a7a7494c1e038dd93fb57c2364a/src/clear.ts#L22)

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
