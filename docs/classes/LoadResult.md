[yaml-datastore](../README.md) / LoadResult

# Class: LoadResult

Defined in: [load.ts:104](https://github.com/dof-initiative/yaml-datastore/blob/1cf8687cf5c8c83d19f0109ffcd744722ae7a336/src/load.ts#L104)

Represents results of a call to the load function

## Constructors

### Constructor

```ts
new LoadResult(
   success: boolean, 
   element: any, 
   message: string): LoadResult;
```

Defined in: [load.ts:117](https://github.com/dof-initiative/yaml-datastore/blob/1cf8687cf5c8c83d19f0109ffcd744722ae7a336/src/load.ts#L117)

Default constructor for LoadResult

#### Parameters

##### success

`boolean`

success status of load() operation

##### element

`any`

element read into memory by load() operation

##### message

`string`

message describing success status of load() operation

#### Returns

`LoadResult`

new LoadResult object

## Accessors

### element

#### Get Signature

```ts
get element(): any;
```

Defined in: [load.ts:131](https://github.com/dof-initiative/yaml-datastore/blob/1cf8687cf5c8c83d19f0109ffcd744722ae7a336/src/load.ts#L131)

##### Returns

`any`

element read into memory on success or null on failure.

***

### message

#### Get Signature

```ts
get message(): string;
```

Defined in: [load.ts:135](https://github.com/dof-initiative/yaml-datastore/blob/1cf8687cf5c8c83d19f0109ffcd744722ae7a336/src/load.ts#L135)

##### Returns

`string`

element path on success or an explanation of the failure.

***

### success

#### Get Signature

```ts
get success(): boolean;
```

Defined in: [load.ts:127](https://github.com/dof-initiative/yaml-datastore/blob/1cf8687cf5c8c83d19f0109ffcd744722ae7a336/src/load.ts#L127)

##### Returns

`boolean`

success status.
