import { expectNotType, expectType } from 'tsd';
import { __, compose, filter, identity, isNotNil, pipe, map } from '../es';

type StringOrUndefined = string | undefined;
declare function testFunc<T>(arg: T) : boolean;

expectType<string[]>(filter(isNotNil, [] as StringOrUndefined[]));
expectType<string[]>(filter(isNotNil)([] as StringOrUndefined[]));
expectType<string[]>(filter(__, [] as StringOrUndefined[])(isNotNil));

expectType<StringOrUndefined[]>(filter(testFunc, [] as StringOrUndefined[]));
expectType<StringOrUndefined[]>(filter(testFunc)([] as StringOrUndefined[]));
expectType<StringOrUndefined[]>(filter(__, [] as StringOrUndefined[])(testFunc));

const gt5 = (num: number) => num > 5;
const typed: number[] = [];
const inferred = [1, 4, 6, 10];
const readOnlyArr: readonly number[] = [1, 4, 6, 10];
const tuple = [1, 4, 6, 10] as const;


expectType<number[]>(filter(testFunc, typed));
expectType<number[]>(filter(testFunc)(typed));

// typed variables
expectType<number[]>(filter(gt5, typed));
expectType<number[]>(filter(gt5)(typed));
// un-typed variable
expectType<number[]>(filter(gt5, inferred));
expectType<number[]>(filter(gt5)(inferred));
// readonly
expectType<number[]>(filter(gt5, readOnlyArr));
expectType<number[]>(filter(gt5)(readOnlyArr));
// literal
expectType<number[]>(filter(gt5, [1, 4, 6, 10]));
expectType<number[]>(filter(gt5)([1, 4, 6, 10]));
// tuple
expectNotType<number[]>(filter(gt5, tuple));
expectType<number[]>(filter(gt5)(tuple));

// pipe
expectType<number[]>(pipe(filter(gt5))(typed));
expectType<number[]>(pipe(filter(gt5), map(identity))(typed));

// compose
expectType<number[]>(compose(filter(gt5))(typed));
// this one works for pipe above, but does not for compose, the issue is likely the compose definition and not filter
// expectType<number[]>(compose(map(identity), filter(gt5))(typed));

// curried
// typed variables
expectType<number[]>(filter(__, typed)(gt5));
// un-typed variable
expectType<number[]>(filter(__, inferred)(gt5));
// readonly
expectType<readonly number[]>(filter(__, readOnlyArr)(gt5));

//
// object
//
type Dictionary = Record<'a' | 'b', string | undefined>;
// filter(isNotNil, dict)
expectType<Partial<Record<keyof Dictionary, string>>>(filter(isNotNil, {} as Dictionary));
// // filter(isNotNil)(dict),  doesn't get the benefit of type narrows :-(
// expectType<Partial<Record<keyof Dictionary, string>>>(filter<'o', string | undefined, string>(isNotNil)({} as Dictionary));

type Obj = { foo: number; bar: number; };

const typedO: Obj = { foo: 4, bar: 6 };
const inferredO = { foo: 4, bar: 6 };
const asConst = { foo: 4, bar: 6 } as const;

// typed variables
// expectType<Obj>(filter<'o'>(gt5, typedO));
// expectType<Obj>(filter(gt5)(typedO));
// un-typed variable
// expectType<Obj>(filter(gt5, inferredO));
// expectType<Obj>(filter(gt5)(inferredO));
// readonly
// expectType<{ readonly foo: 4, readonly bar: 6 }>(filter(gt5, asConst));
// expectType<{ readonly foo: 4, readonly bar: 6 }>(filter(gt5)(asConst));
// literal
// expectType<Obj>(filter(gt5, { foo: 4, bar: 6 }));
// expectType<Obj>(filter(gt5)({ foo: 4, bar: 6 }));

// pipe
// expectType<Obj>(pipe(filter(gt5), map(identity))(typedO));
// expectType<Obj>(pipe(map(identity), filter(gt5))(typedO));

// compose
// expectType<Obj>(compose(filter(gt5))(typedO));

// curried
// typed variables
expectType<Record<keyof Obj, number>>(filter(__, typedO)(gt5));
// un-typed variable
expectType<Obj>(filter(__, inferredO)(gt5));
// readonly
expectType<{ readonly foo: 4, readonly bar: 6 }>(filter(__, asConst)(gt5));
// literal
expectType<Obj>(filter(__, { foo: 4, bar: 6 })(gt5));
