'use client'

import { ParkingLocation } from '@/schemas/parking-locations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
//import { updateLocation } from '@/actions/actions'
//import { usePathname } from 'next/navigation'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    numberofspots: z
        .coerce
        .number({ invalid_type_error: "must be a number" })
        .positive({ message: 'Value must be positive' })
        .finite({ message: "Must be a valid number" }),
    hourly: z
        .coerce
        .number({ invalid_type_error: "must be a number" })
        .positive({ message: 'Value must be positive' })
        .finite({ message: "Must be a valid number" })
})

type FormInput = z.infer<typeof FormSchema>

function LocationEditForm({ location,id }: { location: string ,id:string}) {

    const parsedLocation = JSON.parse(location) as ParkingLocation
    const [progress, setProgress] = useState(false)
    //const pathname = usePathname()
    
    const router = useRouter();

    const form = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            numberofspots: parsedLocation.numberofspots,
            hourly: parsedLocation.price.hourly
        }
    })

    const onSubmit = async (data: FormInput) => {
        setProgress(true)
        //console.log(data);
        try{
            const response = await fetch(`/api/edit-location/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setProgress(false)
                router.replace('/dashboard/locations/tileview')
            } else {
                console.log('Failed to update status');
            }
        }catch(error){
            console.log(error);            
        }
    }

    return (
        <div className='sm:container mt-2 sm:w-1/2 flex flex-col bg-white pt-10 pb-10 p-4 rounded gap-y-4 items-center'>
            <p className='sm:text-2xl'>{parsedLocation.address}</p>
            <div className='container flex flex-col gap-y-2'>
            <p className=''>Price</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-2'>
                    <FormField
                        control={form.control}
                        name='hourly'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder='e.g. 10' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p>Number of spots</p>
                    <FormField
                        control={form.control}
                        name='numberofspots'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder='e.g. 10' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col mt-4">
                        {
                            progress ? <Loader /> :
                                <>
                                    <Button type='submit'>Save</Button>
                                    <Button type='button' variant='ghost'
                                        onClick={() => window.history.back()} >Back</Button>
                                </>

                        }
                    </div>
                </form>
            </Form>
            </div>
        </div>
    )
}

export default LocationEditForm