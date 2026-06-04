[yaml-datastore](../README.md) / clear

# Function: clear()

```ts
function clear(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [clear.ts:22](https://github.com/dof-initiative/yaml-datastore/blob/a8b2a477e6f0ea057d7c24cf980ee85e8da5385a/src/clear.ts#L22)

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
