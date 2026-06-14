import { describe, it, expect } from 'vitest'
import { el, qs, mount } from '../dom'

describe('el', () => {
  it('creates element with correct tag', () => {
    const div = el('div')
    expect(div.tagName).toBe('DIV')
  })
  it('sets attributes', () => {
    const btn = el('button', { class: 'foo', type: 'button' })
    expect(btn.getAttribute('class')).toBe('foo')
    expect(btn.getAttribute('type')).toBe('button')
  })
  it('appends string child', () => {
    const p = el('p', {}, 'hello')
    expect(p.textContent).toBe('hello')
  })
  it('appends element child', () => {
    const span = document.createElement('span')
    const div = el('div', {}, span)
    expect(div.firstChild).toBe(span)
  })
  it('appends multiple children', () => {
    const a = document.createElement('b')
    const b = document.createElement('i')
    const div = el('div', {}, a, b)
    expect(div.childNodes).toHaveLength(2)
  })
  it('returns the correct element subtype', () => {
    const input = el('input', { type: 'text' })
    expect(input instanceof HTMLInputElement).toBe(true)
  })
  it('works with no attrs and no children', () => {
    const span = el('span')
    expect(span.tagName).toBe('SPAN')
    expect(span.childNodes).toHaveLength(0)
  })
})

describe('qs', () => {
  it('returns null when selector not found', () => {
    expect(qs('.nonexistent-xyzzy')).toBeNull()
  })
  it('finds element in custom root', () => {
    const root = document.createElement('div')
    const span = document.createElement('span')
    span.className = 'target'
    root.append(span)
    expect(qs('.target', root)).toBe(span)
  })
  it('does not find element outside root', () => {
    const root = document.createElement('div')
    expect(qs('body', root)).toBeNull()
  })
})

describe('mount', () => {
  it('appends child to parent', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    mount(parent, child)
    expect(parent.firstChild).toBe(child)
  })
})
