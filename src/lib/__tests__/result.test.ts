import { describe, it, expect } from 'vitest'
import { ok, err, isOk, isErr } from '../result'

describe('Result', () => {
  it('ok crée un succès', () => {
    const r = ok(42)
    expect(r.ok).toBe(true)
    expect(isOk(r) && r.value).toBe(42)
  })
  it('err crée une erreur', () => {
    const r = err('oops')
    expect(r.ok).toBe(false)
    expect(isErr(r) && r.error).toBe('oops')
  })
  it('isOk / isErr sont corrects', () => {
    expect(isOk(ok(1))).toBe(true)
    expect(isOk(err('x'))).toBe(false)
    expect(isErr(err('x'))).toBe(true)
    expect(isErr(ok(1))).toBe(false)
  })
})
