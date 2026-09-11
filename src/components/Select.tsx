import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type KeyboardEvent,
  type OptionHTMLAttributes,
  type ReactNode,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { ChevronDown } from './icons'
import { FieldLabel } from './FieldLabel'
import { FieldHelperText } from './FieldHelperText'
import { Menu, MenuItem } from './Menu'

const control = cva(
  [
    'relative flex items-center gap-2 w-full px-3 rounded-md border border-solid',
    'text-left transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
  ],
  {
    variants: {
      size: { sm: 'h-8', md: 'h-10', lg: 'h-12' },
      state: {
        default: 'bg-surface-default border-border-default',
        error: 'bg-surface-default border-2 border-feedback-danger-border',
        disabled: 'bg-surface-sunken border-border-subtle cursor-not-allowed',
      },
    },
    defaultVariants: { size: 'sm', state: 'default' },
  },
)

const value = cva(['min-w-0 flex-1 truncate'], {
  variants: {
    size: { sm: 'text-body-sm', md: 'text-body-md', lg: 'text-body-lg' },
    muted: { true: 'text-text-muted', false: 'text-text-primary' },
  },
  defaultVariants: { size: 'sm', muted: false },
})

type Option = { value: string; label: ReactNode; text: string; disabled: boolean }

/**
 * Read the `<option>` children into a list.
 *
 * The options stay written as `<option>` elements because that is what a select
 * looks like in every codebase, and because it keeps the markup portable: the
 * same children would work if this ever went back to a native control. They are
 * never rendered as options — they are a declaration, and this turns them into
 * the rows of the listbox.
 */
function readOptions(children: ReactNode): Option[] {
  const found: Option[] = []

  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return

      if (child.type === 'option') {
        const props = child.props as OptionHTMLAttributes<HTMLOptionElement> & { children?: ReactNode }
        const optionValue = String(props.value ?? '')
        const label = props.children ?? optionValue
        found.push({
          value: optionValue,
          label,
          // Typeahead needs something to match against. A label that is not a
          // plain string falls back to the value, which is better than nothing
          // and never wrong.
          text: (typeof label === 'string' ? label : optionValue).toLowerCase(),
          disabled: Boolean(props.disabled),
        })
        return
      }

      // Fragments and groups: keep looking inside.
      const nested = (child.props as { children?: ReactNode })?.children
      if (nested) walk(nested)
    })
  }

  walk(children)
  return found
}

export type SelectProps = Pick<VariantProps<typeof control>, 'size'> & {
  /** The `<option>` elements to choose between. */
  children?: ReactNode
  /** Controlled value. Leave unset and use defaultValue to let Select own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Submitted with the form, through a hidden input carrying the value. */
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  /** Shown when the value matches no option. */
  placeholder?: ReactNode
  /** Keep the label visible: a select with only a placeholder gives no context. */
  label?: ReactNode
  supporting?: ReactNode
  helperText?: ReactNode
  /** Validation message. Switches the control to the error treatment. */
  error?: ReactNode
  className?: string
}

/**
 * Lets the user choose one option from a list that stays collapsed until
 * opened.
 *
 * Use when there are more than about five mutually exclusive options, or the
 * options are familiar enough that the user does not need to see them all to
 * decide. Two or three options worth comparing at a glance need Radio;
 * freeform input needs TextField.
 *
 * The open list is a Menu, as it is in Figma — one floating surface in the
 * system rather than the browser's own popup, which cannot be styled and looks
 * different on every platform.
 *
 * That means the behaviour a native `<select>` gives away has to be built here,
 * and it is: the trigger is a combobox, the list a listbox of options, arrow
 * keys and Home and End move through it skipping disabled rows, Enter and Space
 * choose, Escape closes and returns focus to the trigger, Tab closes on the way
 * past, typing jumps to the option that starts with what you typed, and a click
 * anywhere else dismisses it.
 *
 * The one thing it cannot give back is the mobile picker: a native select opens
 * the operating system's own wheel, which is easier to use on a phone than any
 * list a page can draw. Worth knowing if a form is mostly used on mobile.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    className,
    size = 'sm',
    children,
    value: controlledValue,
    defaultValue,
    onValueChange,
    name,
    id,
    disabled = false,
    required = false,
    placeholder,
    label,
    supporting,
    helperText,
    error,
  },
  ref,
) {
  const options = useMemo(() => readOptions(children), [children])

  const [ownValue, setOwnValue] = useState(defaultValue ?? '')
  const current = controlledValue ?? ownValue
  const selectedIndex = options.findIndex((option) => option.value === current)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const [open, setOpen] = useState(false)
  // Which row the keyboard is on. Focus moves to the row itself rather than
  // being tracked with aria-activedescendant: a real focus ring is one less
  // thing to reimplement, and it keeps the tick, the hover and the focus all
  // describing the same row.
  const [active, setActive] = useState(-1)

  const generatedId = useId()
  const selectId = id ?? generatedId
  const listId = `${selectId}-list`
  const messageId = `${selectId}-message`
  const message = error ?? helperText
  const state = disabled ? 'disabled' : error ? 'error' : 'default'

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])
  const typed = useRef({ buffer: '', at: 0 })

  const setTrigger = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const firstEnabled = (from: number, step: number) => {
    for (let i = from; i >= 0 && i < options.length; i += step) {
      if (!options[i].disabled) return i
    }
    return -1
  }

  const openList = (start: 'selected' | 'first' | 'last') => {
    if (disabled || options.length === 0) return
    const at =
      start === 'last'
        ? firstEnabled(options.length - 1, -1)
        : start === 'selected' && selectedIndex >= 0 && !options[selectedIndex].disabled
          ? selectedIndex
          : firstEnabled(0, 1)
    setActive(at)
    setOpen(true)
  }

  const close = (returnFocus: boolean) => {
    setOpen(false)
    setActive(-1)
    if (returnFocus) triggerRef.current?.focus()
  }

  const choose = (index: number) => {
    const option = options[index]
    if (!option || option.disabled) return
    if (controlledValue === undefined) setOwnValue(option.value)
    onValueChange?.(option.value)
    close(true)
  }

  // Move focus onto the active row whenever it changes while open.
  useEffect(() => {
    if (!open || active < 0) return
    rowRefs.current[active]?.focus()
  }, [open, active])

  // A click anywhere outside dismisses, without stealing focus back — the
  // person is already on their way somewhere else.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || listRef.current?.contains(target)) return
      setOpen(false)
      setActive(-1)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  /** Jump to the first option starting with what has just been typed. */
  const typeahead = (key: string) => {
    const now = Date.now()
    typed.current.buffer = now - typed.current.at > 600 ? key : typed.current.buffer + key
    typed.current.at = now

    const term = typed.current.buffer.toLowerCase()
    const at = options.findIndex((option) => !option.disabled && option.text.startsWith(term))
    if (at >= 0) {
      setActive(at)
      if (!open) setOpen(true)
    }
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        openList('selected')
        break
      case 'ArrowUp':
        event.preventDefault()
        openList('last')
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault()
          typeahead(event.key)
        }
    }
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const next = firstEnabled(active + 1, 1)
        if (next >= 0) setActive(next)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const previous = firstEnabled(active - 1, -1)
        if (previous >= 0) setActive(previous)
        break
      }
      case 'Home':
        event.preventDefault()
        setActive(firstEnabled(0, 1))
        break
      case 'End':
        event.preventDefault()
        setActive(firstEnabled(options.length - 1, -1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      case 'Tab':
        // Let focus carry on out of the control, but do not leave the list open
        // behind it.
        close(false)
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault()
          typeahead(event.key)
        }
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <FieldLabel
          htmlFor={selectId}
          label={label}
          supporting={supporting}
          required={required}
          disabled={disabled}
        />
      ) : null}

      <div className="relative">
        <button
          ref={setTrigger}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-haspopup="listbox"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          disabled={disabled}
          onClick={() => (open ? close(false) : openList('selected'))}
          onKeyDown={onTriggerKeyDown}
          className={control({ size, state })}
        >
          <span className={value({ size, muted: disabled || !selected })}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={size === 'lg' ? 24 : 16}
            strokeWidth={2}
            aria-hidden
            className={cn(
              'shrink-0 transition-transform duration-[var(--duration-base)]',
              disabled ? 'text-icon-muted' : 'text-icon-default',
              open && 'rotate-180',
            )}
          />
        </button>

        {open ? (
          <Menu
            ref={listRef}
            role="listbox"
            id={listId}
            aria-labelledby={label ? selectId : undefined}
            onKeyDown={onListKeyDown}
            className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 origin-top overflow-y-auto motion-safe:animate-[select-open_var(--duration-slow)_var(--ease-enter)]"
          >
            {options.map((option, index) => (
              <MenuItem
                key={`${option.value}-${index}`}
                ref={(node) => {
                  rowRefs.current[index] = node
                }}
                role="option"
                selected={option.value === current}
                disabled={option.disabled}
                tabIndex={-1}
                onClick={() => choose(index)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        ) : null}
      </div>

      {/* The value, for a form that submits this. */}
      {name ? <input type="hidden" name={name} value={current} /> : null}

      {message ? (
        <FieldHelperText id={messageId} error={Boolean(error)} disabled={disabled}>
          {message}
        </FieldHelperText>
      ) : null}
    </div>
  )
})
