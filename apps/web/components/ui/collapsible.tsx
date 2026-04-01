'use client';

import { cn } from '@web/lib/utils';
import * as React from 'react';

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
  toggle: () => {},
});

function Collapsible({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
  children,
  ...props
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<'div'>, 'children'>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const toggle = React.useCallback(() => {
    const next = !open;
    setInternalOpen(next);
    onOpenChange?.(next);
  }, [open, onOpenChange]);

  const ctx = React.useMemo(() => ({ open, toggle }), [open, toggle]);

  return (
    <CollapsibleContext.Provider value={ctx}>
      <div
        data-state={open ? 'open' : 'closed'}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
} & Omit<React.ComponentProps<'button'>, 'children'>) {
  const { toggle } = React.useContext(CollapsibleContext);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') toggle();
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </span>
  );
}

function CollapsibleContent({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { open } = React.useContext(CollapsibleContext);
  if (!open) return null;

  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
