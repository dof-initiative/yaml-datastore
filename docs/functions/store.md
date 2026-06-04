[yaml-datastore](../README.md) / store

# Function: store()

```ts
function store(
   element: object, 
   workingDirectoryPath: string, 
   elementName: string): YdsResult;
```

Defined in: [store.ts:299](https://github.com/dof-initiative/yaml-datastore/blob/f23da334312b272bcef3808b0bab076761ce7c6b/src/store.ts#L299)

Dumps in-memory representation of contents to on-disk representation

## Parameters

### element

`object`

object or list to store on-disk

### workingDirectoryPath

`string`

relative or absolute path to an empty working directory to store element in

### elementName

`string`

name of element to store

## Returns

[`YdsResult`](../classes/YdsResult.md)

a YdsResult containing the status of the call to store function
