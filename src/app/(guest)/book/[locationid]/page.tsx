"use client"
import { createRazorpayOrder } from '@/actions/razorpay'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatAmountForDisplay, getStreetFromAddress } from '@/lib/utils'
import { ParkingLocation } from '@/schemas/parking-locations'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInMinutes, format } from 'date-fns'
import { ArrowRight, Loader } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    plateno: z.string().min(1, {
        message: "Plate number must be at least 1 character.",
    }),
});

function BookPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<ParkingLocation | null>(null);

    const params = useParams<{ locationid: string }>();
    const searchParams = useSearchParams();
    const locationId = params?.locationid || "";
    const date = searchParams.get("date");
    const startTime = searchParams.get("starttime");
    const endTime = searchParams.get("endtime");
    
    if (!date || !startTime || !endTime) {
        throw new Error("Invalid date or time");
    }
    const parsedDate = useMemo(() => new Date(date), [date]);
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
    }
    const [hours, minutes] = startTime.split(":").map(Number);
    const [hr, min] = endTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format");
    }
    if (isNaN(hr) || isNaN(min)) {
        throw new Error("Invalid time format");
    }
    const combinedDate = useMemo(() => {
        const newDate = new Date(parsedDate);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }, [parsedDate, hours, minutes]);
    
    const combinedDate2 = useMemo(() => {
        const newDate = new Date(parsedDate);
        newDate.setHours(hr, min, 0, 0);
        return newDate;
    }, [parsedDate, hr, min]);
    


    const diffInHours = useMemo(() => {
        return differenceInMinutes(combinedDate2, combinedDate) / 60;
    }, [combinedDate, combinedDate2]);
    
    useEffect(() => {
        if (!locationId) {
            setError("Invalid location ID.");
            return;
        }

        setLoading(true);
        (async () => {
            try {
                const response = await fetch(`/api/parking-locations/${locationId}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.success) {
                    setLocation(data.location as ParkingLocation);
                } else {
                    setError(data.message || "Failed to fetch location.");
                }
            } catch (err) {
                console.error("Error fetching location:", err);
                setError("Unable to load parking location.");
            } finally {
                setLoading(false);
            }
        })();
    }, [locationId]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            plateno: ''
        }
    })
    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        //console.log(formData);
        const fd = new FormData()
        //console.log(location);
        if (!location) {
            console.error("Location is null");
            throw new Error("Location details are required to proceed");
        }
        if(!location.address){
            console.error("Address is null or undefined");
        }
        const amount = diffInHours *( location?.price.hourly || 0)
        fd.append('address', getStreetFromAddress(location.address))
        fd.append('amount', `${amount}`)
        fd.append('locationid', `${location?._id}`)
        fd.append('bookingdate', date!)
        fd.append('starttime', startTime!)
        fd.append('endtime', endTime!)
        fd.append('plate', formData.plateno)
        await createRazorpayOrder(fd);
        //console.log(fd);
        /*const bookingdate = fd.get('bookingdate')
    const starttime = fd.get('starttime')
    const endtime = fd.get('endtime')
    console.log(bookingdate);
    console.log(starttime);
    console.log(endtime);*/
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className='h-screen'>
            <main className="mt-16 sm:container flex flex-col items-center">

                <div className="grid grid-cols-3 w-[400px] sm:w-[600px] p-4 bg-slate-300">

                    <div className="space-y-1 sm:justify-self-center">
                        <h4 className="flex items-center text-gray-500"><ArrowRight className='mr-2 h-4 w-4' />Entrance</h4>
                        {<p className="text-sm font-bold">{format(combinedDate, 'MMM, dd yyyy HH:mm a')}</p>}
                    </div>

                    <div className="h-10 self-center justify-self-center">
                        <Separator className='bg-gray-400' orientation='vertical' />
                    </div>

                    <div className="space-y-1 sm:justify-self-center">
                        <h4 className="flex items-center text-gray-500">Exit<ArrowRight className='ml-2 h-4 w-4' /></h4>
                        {<p className="text-sm font-bold">{format(combinedDate2, 'MMM, dd yyyy HH:mm a')}</p>}
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white w-[400px] sm:w-[600px] border p-4 shadow flex flex-col pt-12 pb-12 space-y-4' >
                        <div>
                            {location && <p className='font-bold text-xl'>{getStreetFromAddress(location.address)}</p>}
                        </div>

                        <div className="flex flex-col bg-slate-100 p-4 gap-y-2 rounded">
                            <div className="flex justify-between text-sm font-bold">
                                <p>Hourly rate</p>
                                <p>{location ? formatAmountForDisplay(location.price.hourly, 'INR') : '...'}</p>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <p>{diffInHours} Hours</p>
                                <p>{location ? formatAmountForDisplay(diffInHours * location.price.hourly, 'INR') : '...'}</p>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name='plateno'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Plate #
                                    </FormLabel>
                                    <FormControl>
                                        <Input className='uppercase' placeholder='ABCD 1234' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Make sure your license plate matches the vehicle you park to avoid a parking ticket or towing.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {
                            loading ? <Loader /> :
                                <Button>Proceed to payment</Button>
                        }
                    </form>
                </Form>
            </main>
            <section className='mt-20 w-full sm:bottom-0'>
                <Footer />
            </section>
        </div>
    )
}

export default BookPage;