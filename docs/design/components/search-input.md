# SearchInput

Full-featured search field for the catalog. Appears in the Navbar on desktop.
Mobile: icon in nav that opens an overlay full-width search.

---

## Anatomy

```
┌──────────────────────────────────────────┐
│ 🔍  Search stories…                      │
└──────────────────────────────────────────┘
     ↑ leading search icon (16px, text-muted)
          ↑ placeholder text (text-muted)
```

On focus: border changes to `border-brand-600`, subtle `shadow-sm`.

---

## TypeScript Interface

```tsx
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;   // fires on Enter
  className?: string;
}
```

---

## Implementation

```tsx
// components/ui/search-input.tsx
'use client';

import { Search, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function SearchInput({
  placeholder = 'Search stories…',
  value: controlledValue,
  onChange,
  onSearch,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue ?? internalValue;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch?.(value);
    if (e.key === 'Escape') {
      setInternalValue('');
      onChange?.('');
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        size={16}
        className="absolute left-3 text-text-muted pointer-events-none"
        aria-hidden
      />

      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-9 w-full pl-9 pr-9 text-sm bg-surface-page',
          'rounded-input border border-border',
          'text-text-primary placeholder:text-text-muted',
          'transition-colors duration-fast',
          'focus:outline-none focus:border-brand-600 focus:shadow-sm',
          'hover:border-border-strong',
        )}
      />

      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 text-text-muted hover:text-text-primary transition-colors duration-fast
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```

---

## Sizes

| Context | Width | Token |
|---|---|---|
| Navbar (desktop) | 256px | `w-64` |
| Catalog page header | 320px | `w-80` |
| Mobile overlay | 100% | `w-full` |

---

## Usage

```tsx
// Navbar
<SearchInput placeholder="Search stories…" className="w-64" />

// Controlled (catalog page with live filter)
<SearchInput
  placeholder="Search stories…"
  value={query}
  onChange={setQuery}
  onSearch={(v) => router.push(`/catalog?q=${v}`)}
  className="w-80"
/>
```

---

## Do / Don't

✓ Use `type="search"` for native browser clear button and mobile keyboard hint  
✓ Always include an accessible clear button when the input has a value  
✓ Show clear (`X`) only when there is a value — don't show it on empty state  
✗ Don't use `type="text"` — `type="search"` is semantically correct  
✗ Don't add a separate search button — Enter key is the convention  
