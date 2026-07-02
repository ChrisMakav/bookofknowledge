# FAB (Floating Action Button)

Fixed circular button anchored to the bottom-right of the viewport. Used in the library view to add a new book.

---

## Anatomy

```
                         ┌───┐
                         │ + │  ← 56×56px circle, bg-brand-600
                         └───┘
                              ↑ fixed, bottom-5, right-5
```

On hover: `shadow-lg`, slight upward translate (`-translate-y-0.5`), `ease-spring`.

---

## TypeScript Interface

```tsx
interface FABProps {
  icon?:      React.ReactNode;   // defaults to <Plus />
  label:      string;            // accessible label, e.g. "Add book to library"
  onClick:    () => void;
}
```

---

## Implementation

```tsx
// components/ui/fab.tsx
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAB({ icon = <Plus size={24} />, label, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'fixed bottom-5 right-5 z-40',
        'size-14 rounded-full bg-brand-600 text-white',
        'flex items-center justify-center',
        'shadow-lg',
        'transition-all duration-slow ease-spring',
        'hover:shadow-xl hover:-translate-y-0.5 hover:bg-brand-700',
        'active:scale-95 active:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
      )}
    >
      {icon}
    </button>
  );
}
```

---

## Entrance Animation

The FAB should appear after the page content loads, not immediately. This prevents it from competing with the page's primary visual load.

```tsx
'use client';

import { useEffect, useState } from 'react';

export function FABDelayed(props: FABProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={cn(
      'transition-all duration-slow ease-spring',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    )}>
      <FAB {...props} />
    </div>
  );
}
```

---

## Usage

```tsx
// Library page
<FABDelayed
  label="Add book to library"
  onClick={() => setAddBookOpen(true)}
/>
```

---

## Do / Don't

✓ Always provide an `aria-label` — the `+` icon has no inherent meaning  
✓ Use `ease-spring` for hover and entrance — it gives the button personality  
✓ Delay entrance by ~400ms after page load  
✗ Don't use the FAB on every page — it's specific to the library view  
✗ Don't add a text label next to the icon — the FAB is an icon button  
