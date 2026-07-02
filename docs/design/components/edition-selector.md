# EditionSelector

Tab-style format picker on the book detail page. Lets readers choose between Hardcover, Paperback, and E-Book editions, each with a price.

---

## Anatomy

```
┌────────────────────────────────────────┐
│                                        │
│  HARDCOVER    PAPERBACK    E-BOOK      │
│  $24.99       $16.50       $9.99       │
│  ──────────                            │
│  ↑ selected (border, bold)             │
│              ↑ default (no border)     │
└────────────────────────────────────────┘
```

Selected edition: `border border-text-primary rounded-lg`, price in `text-brand-600`.
Unselected: `text-text-secondary`, no border.

---

## TypeScript Interface

```tsx
interface Edition {
  key:   'hardcover' | 'paperback' | 'ebook';
  label: string;
  price: number;
}

interface EditionSelectorProps {
  editions:        Edition[];
  selectedKey:     Edition['key'];
  onSelect:        (key: Edition['key']) => void;
}
```

---

## Implementation

```tsx
// components/books/edition-selector.tsx
import { cn } from '@/lib/utils';

export function EditionSelector({ editions, selectedKey, onSelect }: EditionSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Choose an edition"
      className="flex gap-2"
    >
      {editions.map(({ key, label, price }) => {
        const isSelected = selectedKey === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            aria-pressed={isSelected}
            className={cn(
              'flex flex-col items-center px-4 py-3 rounded-lg text-left',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              isSelected
                ? 'border-2 border-text-primary bg-surface-card'
                : 'border border-border bg-surface-page hover:border-border-strong',
            )}
          >
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                isSelected ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                'text-sm font-bold mt-0.5',
                isSelected ? 'text-brand-600' : 'text-text-secondary',
              )}
            >
              ${price.toFixed(2)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

---

## Usage

```tsx
const [edition, setEdition] = useState<Edition['key']>('hardcover');

const editions: Edition[] = [
  { key: 'hardcover', label: 'Hardcover', price: 24.99 },
  { key: 'paperback', label: 'Paperback', price: 16.50 },
  { key: 'ebook',     label: 'E-Book',    price:  9.99 },
];

<EditionSelector
  editions={editions}
  selectedKey={edition}
  onSelect={setEdition}
/>

{/* Price updates downstream */}
<Button size="lg" icon={<ShoppingCart size={18} />}>
  Buy Now — ${editions.find(e => e.key === edition)?.price.toFixed(2)}
</Button>
```

---

## Do / Don't

✓ Use `aria-pressed` on each button — this is a toggle group  
✓ Update the "Buy Now" button price reactively when edition changes  
✓ Default to `hardcover` — it's the anchor price  
✗ Don't use radio inputs visually styled as buttons — native button elements are simpler  
✗ Don't reorder editions — Hardcover → Paperback → E-Book is the expected order (price descending)  
