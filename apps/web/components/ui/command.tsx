'use client';

import { Modal, ModalBody, ModalHeader, ModalHeading } from '@heroui/react';
import { cn } from '@web/lib/utils';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
};

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
});

/* ------------------------------------------------------------------ */
/*  Command (root)                                                    */
/* ------------------------------------------------------------------ */

function Command({
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  const [search, setSearch] = React.useState('');

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        data-slot="command"
        className={cn(
          'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
          className,
        )}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  CommandDialog                                                     */
/* ------------------------------------------------------------------ */

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  ...props
}: React.ComponentProps<typeof Modal> & {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <Modal {...props}>
      <ModalHeader className="sr-only">
        <ModalHeading>{title}</ModalHeading>
        <p className="text-muted-foreground text-sm">{description}</p>
      </ModalHeader>
      <ModalBody className={cn('overflow-hidden p-0', className)}>
        <Command>{children}</Command>
      </ModalBody>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  CommandInput                                                      */
/* ------------------------------------------------------------------ */

function CommandInput({
  className,
  value,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const { search, setSearch } = React.useContext(CommandContext);
  const inputValue = value ?? search;

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={inputValue}
        onChange={(e) => {
          const v = e.target.value;
          setSearch(v);
          onValueChange?.(v);
        }}
        {...props}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CommandList                                                       */
/* ------------------------------------------------------------------ */

function CommandList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-list"
      className={cn(
        'max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CommandEmpty                                                      */
/* ------------------------------------------------------------------ */

function CommandEmpty(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CommandGroup                                                      */
/* ------------------------------------------------------------------ */

function CommandGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-group"
      className={cn('text-foreground overflow-hidden p-1', className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CommandSeparator                                                  */
/* ------------------------------------------------------------------ */

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-separator"
      className={cn('bg-border -mx-1 h-px', className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CommandItem                                                       */
/* ------------------------------------------------------------------ */

function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<'div'> & {
  onSelect?: () => void;
}) {
  return (
    <div
      data-slot="command-item"
      role="option"
      aria-selected={false}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={onSelect}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CommandShortcut                                                   */
/* ------------------------------------------------------------------ */

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
