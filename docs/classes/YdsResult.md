[**yaml-datastore**](../README.md)

***

[yaml-datastore](../README.md) / YdsResult

# Class: YdsResult

Defined in: [result.ts:4](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/result.ts#L4)

Represents results of a yaml-datastore operation

## Constructors

### Constructor

> **new YdsResult**(`success`, `element`, `message`): `YdsResult`

Defined in: [result.ts:17](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/result.ts#L17)

Default constructor for YdsResult

#### Parameters

##### success

`boolean`

success status of a yaml-datastore operation

##### element

`any`

element read into memory or stored on-disk per yaml-datastore operation

##### message

`string`

message describing success status of a yaml-datastore operation

#### Returns

`YdsResult`

new YdsResult object

## Accessors

### element

#### Get Signature

> **get** **element**(): `any`

Defined in: [result.ts:31](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/result.ts#L31)

##### Returns

`any`

element read into memory or stored on-disk per yaml-datastore operation.

***

### message

#### Get Signature

> **get** **message**(): `string`

Defined in: [result.ts:35](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/result.ts#L35)

##### Returns

`string`

message describing success status of a yaml-datastore operation.

***

### success

#### Get Signature

> **get** **success**(): `boolean`

Defined in: [result.ts:27](https://github.com/dof-initiative/yaml-datastore/blob/e2c93da4f89fcc48a05e5252b53db8d7c3b44710/src/result.ts#L27)

##### Returns

`boolean`

success status of a yaml-datastore operation.
