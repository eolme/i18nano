import { describe, expect, it } from 'vitest';

import { Lookup } from './shared';

describe('lookup', () => {
  it('empty object', () => {
    expect.assertions(1);
    expect(Lookup.lookup('any', {})).toBe('');
  });

  it('object with non-string value', () => {
    expect.assertions(1);
    expect(Lookup.lookup('number', { number: 1 } as any)).toBe('');
  });

  it.each([
    ['a', { a: '1' }, '1'],
    ['a.b', { a: { b: '2' }}, '2'],
    ['a.b.c', { a: { b: { c: '3' }}}, '3']
  ])('nested object', (path, values, result) => {
    expect.assertions(1);
    expect(Lookup.lookup(path, values)).toBe(result);
  });

  it.each([
    ['a.b', { a: '1' }, '1'],
    ['a.b.c', { a: { b: '2' }}, '2']
  ])('nested object with deeper key', (path, values, result) => {
    expect.assertions(1);
    expect(Lookup.lookup(path, values)).toBe(result);
  });

  it.each([
    [0, ['1'], '1'],
    [1, ['1', '2'], '2'],
    ['0.0', [['3']], '3'],
    ['1.0', ['0', ['4']], '4']
  ])('nested array', (path, values, result) => {
    expect.assertions(1);
    expect(Lookup.lookup(path, values)).toBe(result);
  });

  it.each([
    ['0.0', ['1'], '1'],
    ['0.0.0', [['2']], '2']
  ])('nested array with deeper key', (path, values, result) => {
    expect.assertions(1);
    expect(Lookup.lookup(path, values)).toBe(result);
  });

  it.each([
    ['0.0.0', [[{ 0: '1' }]], '1'],
    ['0.0.0', [{ 0: ['2']}], '2'],
    ['0.0.0', { 0: { 0: ['3']}}, '3'],
    ['0.0.0', { 0: [['4']]}, '4'],
    ['0.0.0', { 0: [{ 0: '5' }]}, '5']
  ])('nested mixed array and object', (path, values, result) => {
    expect.assertions(1);
    expect(Lookup.lookup(path, values)).toBe(result);
  });
});
