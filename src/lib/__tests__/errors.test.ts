import { describe, it, expect } from 'vitest'
import { mapDomException, micError } from '../errors'

describe('mapDomException', () => {
  it('NotAllowedError → permission-denied', () => {
    const e = new DOMException('denied', 'NotAllowedError')
    expect(mapDomException(e).kind).toBe('permission-denied')
  })
  it('NotFoundError → no-device', () => {
    const e = new DOMException('not found', 'NotFoundError')
    expect(mapDomException(e).kind).toBe('no-device')
  })
  it('unknown error → unknown', () => {
    expect(mapDomException(new Error('wtf')).kind).toBe('unknown')
  })
  it('each kind has a non-empty English message', () => {
    const kinds = ['permission-denied', 'no-device', 'insecure-context', 'unsupported-browser', 'unknown'] as const
    kinds.forEach(k => expect(micError(k).message.length).toBeGreaterThan(10))
  })
})
