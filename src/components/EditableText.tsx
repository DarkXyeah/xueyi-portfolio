import { useEdit } from '../context/EditContext'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  as?: 'span' | 'h3' | 'h4' | 'p'
  className?: string
  placeholder?: string
  multiline?: boolean
}

export default function EditableText({
  value,
  onChange,
  as: Tag = 'span',
  className = '',
  placeholder = '点击编辑',
  multiline = false,
}: EditableTextProps) {
  const { editMode } = useEdit()

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const text = e.currentTarget.innerText
    if (text !== value) onChange(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  return (
    <Tag
      contentEditable={editMode}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} ${
        editMode
          ? 'cursor-text rounded-md outline-none ring-1 ring-ember/60 ring-offset-2 ring-offset-ink transition-shadow focus:ring-2'
          : ''
      } ${editMode && !value ? 'text-mist/40' : ''}`}
      style={{
        // 保证空值时仍可点击编辑
        minHeight: editMode ? '1em' : undefined,
        display: editMode ? 'inline-block' : undefined,
      }}
    >
      {value || (editMode ? placeholder : '')}
    </Tag>
  )
}
