import { el } from '../../lib/dom'

export const createButton = (
  label: string,
  onClick: () => void,
  variant: 'default' | 'primary' = 'default',
): HTMLButtonElement => {
  const btn = el('button', { class: `btn${variant === 'primary' ? ' btn--primary' : ''}` }, label)
  btn.addEventListener('click', onClick)
  return btn
}
