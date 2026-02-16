[yaml-datastore](../README.md) / generateIDs

# Function: generateIDs()

```ts
function generateIDs(numIDs: number, numSkip: number): string[];
```

Defined in: [idgen.ts:53](https://github.com/dof-initiative/yaml-datastore/blob/deb2eecec2ca9ce40fe260137488efc5c1ff48c7/src/idgen.ts#L53)

Returns a list of short ID's

## Parameters

### numIDs

`number`

number of short ID's to generate

### numSkip

`number`

a kind of starting index for short ID's

## Returns

`string`[]

a list of short ID's or empty array if numIDs is not an integer or less than one or numSkip is not an integer or less than 0
