[yaml-datastore](../README.md) / clear

# Function: clear()

```ts
function clear(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [clear.ts:22](https://github.com/dof-initiative/yaml-datastore/blob/22ef7937c3f864307ffb5957f11155c170d6d7c1/src/clear.ts#L22)

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
