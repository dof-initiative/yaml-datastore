[yaml-datastore](../README.md) / deleteElement

# Function: deleteElement()

```ts
function deleteElement(
   workingDirectoryPath: string, 
   elementPath: string, 
   depth: number): YdsResult;
```

Defined in: [delete.ts:89](https://github.com/dof-initiative/yaml-datastore/blob/85086ace779cbd64a7ec00f5713d53517f1df77c/src/delete.ts#L89)

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
