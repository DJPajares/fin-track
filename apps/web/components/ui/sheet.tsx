'use client';

import { cn } from '@web/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

type SheetContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */

function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const handleOpenChange = React.useCallback(
    (v: boolean) => {
      setInternalOpen(v);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                           */
/* ------------------------------------------------------------------ */

function SheetTrigger({
  children,
  asChild,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const ctx = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: () => ctx?.onOpenChange(true),
      },
    );
  }
  return (
    <button
      data-slot="sheet-trigger"
      onClick={() => ctx?.onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Close                                                             */
/* ------------------------------------------------------------------ */

function SheetClose({
  children,
  asChild,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const ctx = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: () => ctx?.onOpenChange(false),
      },
    );
  }
  return (
    <button
      data-slot="sheet-close"
      onClick={() => ctx?.onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Side classes                                                      */
/* ------------------------------------------------------------------ */

const sideClasses: Record<string, string> = {
  right:
    'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  top: 'inset-x-0 top-0 h-auto border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
  bottom:
    'inset-x-0 bottom-0 h-auto border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
};

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  const ctx = React.useContext(SheetContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ctx?.open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        data-slot="sheet-overlay"
        className="animate-in fade-in-0 fixed inset-0 z-50 bg-black/50"
        onClick={() => ctx.onOpenChange(false)}
      />
      {/* Panel */}
      <div
        data-slot="sheet-content"
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn(
          'bg-background animate-in fixed z-50 flex flex-col gap-4 shadow-lg transition duration-500 ease-in-out',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <button
          className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          onClick={() => ctx.onOpenChange(false)}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Header / Footer / Title / Description                             */
/* ------------------------------------------------------------------ */

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
