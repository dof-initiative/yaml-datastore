[yaml-datastore](../README.md) / StoreResult

# Class: StoreResult

Defined in: [store.ts:100](https://github.com/dof-initiative/yaml-datastore/blob/bb418cb03e870cdf28157040ab30bb03da20c315/src/store.ts#L100)

Represents results of a call to the store function

## Constructors

### Constructor

```ts
new StoreResult(success: boolean, message: string): StoreResult;
```

Defined in: [store.ts:111](https://github.com/dof-initiative/yaml-datastore/blob/bb418cb03e870cdf28157040ab30bb03da20c315/src/store.ts#L111)

Default constructor for StoreResult

#### Parameters

##### success

`boolean`

success status of store() operation

##### message

`string`

message describing success status of store() operation

#### Returns

`StoreResult`

new StoreResult object

## Accessors

### message

#### Get Signature

```ts
get message(): string;
```

Defined in: [store.ts:120](https://github.com/dof-initiative/yaml-datastore/blob/bb418cb03e870cdf28157040ab30bb03da20c315/src/store.ts#L120)

##### Returns

`string`

file path to root element serialized to disk on success or an explanation of the failure.

***

### success

#### Get Signature

```ts
get success(): boolean;
```

Defined in: [store.ts:116](https://github.com/dof-initiative/yaml-datastore/blob/bb418cb03e870cdf28157040ab30bb03da20c315/src/store.ts#L116)

##### Returns

`boolean`

success status.
