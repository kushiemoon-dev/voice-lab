import { el } from '../../lib/dom'

export const createSelect = <T extends string>(
  options: readonly { value: T; label: string }[],
  onChange: (value: T) => void,
  ariaLabel?: string,
): HTMLSelectElement => {
  const select = el('select', { class: 'select', 'aria-label': ariaLabel ?? 'Sélectionner' })
  for (const opt of options) {
    const o = el('option', { value: opt.value }, opt.label)
    select.append(o)
  }
  select.addEventListener('change', () => { onChange(select.value as T) })
  return select
}
