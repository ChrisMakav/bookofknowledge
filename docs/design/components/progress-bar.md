# ProgressBar

Reading progress indicator. Appears in every library BookCard and on the book detail page.
Fills on mount with a 500ms animation — the motion communicates "you've been here before".

---

## Anatomy

```
65% Read                              120 / 184 pgs
████████████████░░░░░░░░░░░░░░░░░░░░
↑                ↑
filled (brand-600 or success)   track (border-subtle)
```

---

## Color Logic

| Progress | Color |
|---|---|
| < 25% | `brand-200` — just started |
| 25–74% | `brand-600` — in progress (primary) |
| 75–99% | `brand-600` — near done |
| 100% (Finished) | `success` (`#22C55E`) — green completion |

"Finished" state renders the label as "Finished" (not "100% Read") and the bar full-green.

---

## TypeScript Interface

```tsx
interface ProgressBarProps {
  value: number;         // 0–100
  finished?: boolean;
  size?: 'sm' | 'md';   // sm = 3px height, md = 4px height (default md)
  animated?: boolean;    // default true — fills on mount
  className?: string;
}
```

---

## Implementation

```tsx
// components/ui/progress-bar.tsx
'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({
  value,
  finished = false,
  size = 'md',
  animated = true,
  className,
}: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const clamped = Math.min(100, Math.max(0, value));

  const fillColor = finished || clamped >= 100
    ? 'bg-success'
    : clamped >= 25
    ? 'bg-brand-600'
    : 'bg-brand-200';

  const trackHeight = size === 'sm' ? 'h-[3px]' : 'h-1';

  useEffect(() => {
    if (!animated || !fillRef.current) return;
    // Start from 0, animate to target
    fillRef.current.style.width = '0%';
    const id = requestAnimationFrame(() => {
      if (fillRef.current) {
        fillRef.current.style.width = `${finished ? 100 : clamped}%`;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [clamped, finished, animated]);

  return (
    <div
      role="progressbar"
      aria-valuenow={finished ? 100 : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={finished ? 'Finished' : `${clamped}% read`}
      className={cn(
        'w-full rounded-full overflow-hidden',
        trackHeight,
        'bg-border-subtle',
        className,
      )}
    >
      <div
        ref={fillRef}
        className={cn(
          'h-full rounded-full',
          fillColor,
          animated && 'transition-[width] duration-slower ease-out',
        )}
        style={{ width: animated ? '0%' : `${finished ? 100 : clamped}%` }}
      />
    </div>
  );
}
```

---

## Reading Stats Bar Chart

On the "My Library" screen, reading stats render as a bar chart. Each bar is a vertical progress bar variant — same color scheme, different orientation.

```tsx
interface ReadingStatBarProps {
  month: string;   // "Nov", "Dec", etc.
  books: number;
  maxBooks: number;
  isHighlight?: boolean;   // current month = brand-600, others = brand-200
}

export function ReadingStatBar({ month, books, maxBooks, isHighlight }: ReadingStatBarProps) {
  const height = maxBooks > 0 ? `${(books / maxBooks) * 100}%` : '0%';
  return (
    <div className="flex flex-col items-center gap-2">
      {isHighlight && (
        <span className="text-xs font-semibold text-brand-600">{books} books</span>
      )}
      <div className="w-8 h-32 bg-border-subtle rounded-full flex items-end overflow-hidden">
        <div
          className={cn(
            'w-full rounded-full transition-[height] duration-slower ease-out',
            isHighlight ? 'bg-brand-600' : 'bg-brand-200',
          )}
          style={{ height }}
        />
      </div>
      <span className="text-xs text-text-muted">{month}</span>
    </div>
  );
}
```

---

## Usage

```tsx
// In BookCard (library variant)
<ProgressBar value={65} />

// Finished book
<ProgressBar value={100} finished />

// No animation (e.g., in a list that re-renders frequently)
<ProgressBar value={42} animated={false} />

// Bar chart (reading stats panel)
{monthlyData.map((d) => (
  <ReadingStatBar
    key={d.month}
    month={d.month}
    books={d.books}
    maxBooks={maxBooks}
    isHighlight={d.month === currentMonth}
  />
))}
```

---

## Do / Don't

✓ Always include `role="progressbar"` and `aria-valuenow`/`aria-valuemin`/`aria-valuemax`  
✓ Use "Finished" label (not "100% Read") for completed books  
✓ Animate on mount with 500ms — it creates a satisfying reading-history reveal  
✗ Don't use grey for the track — use `border-subtle` which has a slight purple tint  
✗ Don't show a ProgressBar on catalog cards — it implies ownership  
