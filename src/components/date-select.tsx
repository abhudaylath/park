import React from 'react'
import { sub, format } from 'date-fns'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { FormControl } from './ui/form'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

type PropType<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    field: ControllerRenderProps<TFieldValues, TName>;
    disableDates: boolean;
};
function DateSelect<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
    field,
    disableDates,
}: PropType<TFieldValues, TName>) {
    //console.log(typeof params.field);

    const disabled = disableDates ? (date: Date) =>
        date < sub(new Date(), { days: 1 }) : []

    return (
        <div className=''>
            <Popover >
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn('pl-3 text-left font-normal',
                                !field.value && "text-muted-foreground"
                            )} >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={disabled}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DateSelect