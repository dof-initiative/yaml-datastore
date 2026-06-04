[yaml-datastore](../README.md) / clear

# Function: clear()

```ts
function clear(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [clear.ts:22](https://github.com/dof-initiative/yaml-datastore/blob/d5c310f4a30f5e4283b437adca16060fd8beb25d/src/clear.ts#L22)

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
