[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / generateIDs

# Function: generateIDs()

> **generateIDs**(`numIDs`, `numSkip`): `string`[]

Defined in: [idgen.ts:53](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/idgen.ts#L53)

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
