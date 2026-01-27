[yaml-datastore](../README.md) / store

# Function: store()

```ts
function store(
   element: object, 
   workingDirectoryPath: string, 
   elementName: string): StoreResult;
```

Defined in: [store.ts:302](https://github.com/dof-initiative/yaml-datastore/blob/bb418cb03e870cdf28157040ab30bb03da20c315/src/store.ts#L302)

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

[`StoreResult`](../classes/StoreResult.md)

a StoreResult containing the status of the call to store function
