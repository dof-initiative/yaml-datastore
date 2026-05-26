[yaml-datastore](../README.md) / store

# Function: store()

```ts
function store(
   element: object, 
   workingDirectoryPath: string, 
   elementName: string): YdsResult;
```

Defined in: [store.ts:299](https://github.com/dof-initiative/yaml-datastore/blob/22ef7937c3f864307ffb5957f11155c170d6d7c1/src/store.ts#L299)

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
