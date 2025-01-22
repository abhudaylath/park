import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Label } from './ui/label'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import DateSelect from './date-select'
import TimeSelect from './time-select'
import AddressAutoCompleteInput from './address-autocomplete.input'
import { LatLng } from '@/types'


type SearchFormData = {
    address: string;
    arrivingon: Date; // Formatted date as 'yyyy-MM-dd'
    gpscoords: {
        lat: number;
        lng: number;
    };
    arrivingtime: string;
    leavingtime: string;
};


const FormSchema = z.object({
    address: z.string(),
    arrivingon: z.date({
        required_error: "Date is required"
    }),
    // gps coords
    gpscoords: z.object({
        lat: z.number(),
        lng: z.number()
    }),
    arrivingtime: z.string({
        required_error: "Time is required"
    }),
    leavingtime: z.string({
        required_error: "Time is required"
    })
})

function SearchForm({
    onSearch
}: {
    onSearch: (data: SearchFormData) => void
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: '',
            arrivingon: new Date(),
            arrivingtime: '',
            leavingtime: ''
        }
    });

    function onSubmit(formData: z.infer<typeof FormSchema>) {
        const data = { ...formData}
        //console.log(data);
        //console.log("HI");

        onSearch(data)

    }
    const handleAddressSelect = (address: string, gpscoords: LatLng) => {
        form.setValue('address', address)
        form.setValue('gpscoords', gpscoords)
    }
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className='grid gap-y-4 lg:w-1/3'>
                <Label htmlFor='parkingat'>Address</Label>
                <AddressAutoCompleteInput onAddressSelect={handleAddressSelect} selectedAddress='' />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 flex flex-wrap gap-y-4 items-end lg:justify-between">
                    <FormField
                        control={form.control}
                        name='arrivingon'
                        render={({ field }) => (
                            <FormItem className='w-full lg:w-[30%]'>
                                <FormLabel>Arriving on</FormLabel>
                                <FormControl>
                                    <DateSelect field={field} disableDates={true} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='arrivingtime'
                        render={({ field }) => (
                            <FormItem className='w-full lg:w-[23%]'>
                                <FormLabel>Arriving time</FormLabel>
                                <FormControl>
                                    <TimeSelect onChange={field.onChange} defaultValue={field.value} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='leavingtime'
                        render={({ field }) => (
                            <FormItem className='w-full lg:w-[23%]'>
                                <FormLabel>Leaving time</FormLabel>
                                <FormControl>
                                    <TimeSelect disableTime={form.getValues('arrivingtime')} onChange={field.onChange} defaultValue={field.value} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className=''>Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default SearchForm;
