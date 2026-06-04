[yaml-datastore](../README.md) / deleteElement

# Function: deleteElement()

```ts
function deleteElement(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [delete.ts:89](https://github.com/dof-initiative/yaml-datastore/blob/a51f07d853cda5a97287937480b6bc9f0faf5a7d/src/delete.ts#L89)

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
