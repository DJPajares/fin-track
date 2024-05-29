import { Dispatch, SetStateAction, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CurrencyProps } from '../../../api/src/models/v1/currencyModel';
import { ChevronsUpDownIcon } from 'lucide-react';
import { formatDate } from '../../../../shared/utilities/formatDate';

type TransactionDrawerProps = {
  currencies: CurrencyProps[];
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const TransactionDrawer = ({
  currencies,
  isTransactionDrawerOpen,
  setIsTransactionDrawerOpen
}: TransactionDrawerProps) => {
  const [date, setDate] = useState(new Date());
  const [currency, setCurrency] = useState('PHP');
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const changeDate = (newDate: any) => {
    setDate(newDate);
    setIsDatePopoverOpen(false);
  };

  return (
    <Drawer
      open={isTransactionDrawerOpen}
      onOpenChange={setIsTransactionDrawerOpen}
      shouldScaleBackground
    >
      <DrawerContent>
        <DrawerHeader>Transaction</DrawerHeader>

        <div className="flex flex-col justify-between p-4">
          {/* CATEGORY */}
          <Popover
            open={isCategoryPopoverOpen}
            onOpenChange={setIsCategoryPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox">
                {currency}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search category..."
                  className="h-9"
                />
                <CommandEmpty>No categories found</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency._id.toString()}
                        value={currency.name}
                        onSelect={(currentValue: any) => {
                          setCurrency(
                            currentValue === currency ? '' : currentValue
                          );
                          setIsCategoryPopoverOpen(false);
                        }}
                      >
                        {currency.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex flex-row items-center justify-between py-4">
            {/* DATE PICKER */}
            <Popover
              open={isDatePopoverOpen}
              onOpenChange={setIsDatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" className="px-0">
                  <p>{formatDate(date)}</p>
                  {/* <ChevronDownIcon className="h-4 w-4" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={changeDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* CURRENCY */}
            <Popover
              open={isCurrencyPopoverOpen}
              onOpenChange={setIsCurrencyPopoverOpen}
            >
              <PopoverTrigger asChild>
                {/* <Button variant="ghost" className="px-0">
                  <p className="text-3xl sm:text-5xl font-extrabold sm:font-black">
                    {currency}
                  </p>
                </Button> */}
                <Button variant="outline" role="combobox">
                  {currency}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search currency..."
                    className="h-9"
                  />
                  <CommandEmpty>No currencies found</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {currencies.map((currency) => (
                        <CommandItem
                          key={currency._id.toString()}
                          value={currency.name}
                          onSelect={(currentValue: any) => {
                            setCurrency(
                              currentValue === currency ? '' : currentValue
                            );
                            setIsCurrencyPopoverOpen(false);
                          }}
                        >
                          {currency.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Input type="number" />
        </div>

        <DrawerFooter>
          <Button>OK</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDrawer;
