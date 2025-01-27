'use server'

import { connectToDB } from '@/lib/db'
import { razorpay } from '@/lib/razorpay' // Assume you've configured Razorpay SDK
import { BookingModel } from '@/schemas/booking'
import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createRazorpayOrder(data: FormData): Promise<void> {
    const now = new Date()
    const user = await currentUser()

    if (!user) {
        throw new Error("You must be logged in")
    }

    await connectToDB()

    const bookingdate = data.get('bookingdate') as string | null;
    const starttime = data.get('starttime') as string | null;
    const endtime = data.get('endtime') as string | null;
    if (!bookingdate || !starttime || !endtime) {
        throw new Error("Missing required booking date or time fields.");
    }
    const parsedBookingDate = new Date(bookingdate);

    if (isNaN(parsedBookingDate.getTime())) {
        throw new Error("Invalid bookingdate provided");
    }

    // Extract the date portion in 'YYYY-MM-DD' format
    const datePart = parsedBookingDate.toISOString().split('T')[0]; // Example: "2025-01-24"

    // Combine datePart with starttime and endtime
    const startDateTime = new Date(`${datePart}T${starttime}`);
    const endDateTime = new Date(`${datePart}T${endtime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Invalid starttime or endtime provided");
    }

    // Create booking in the database
    const result = await BookingModel.create({
        locationid: data.get('locationid'),
        bookingdate: parsedBookingDate,
        starttime: startDateTime,
        endtime: endDateTime,
        amount: Number(data.get('amount')),
        timeoffset: now.getTimezoneOffset(),
        plate: (data.get('plate') as string).replaceAll(' ', ''),
        userid:  user?.id
    });


    const amount = Number(data.get('amount')) * 100 // Razorpay amount is in paise (e.g., 100 INR = 10000 paise)

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: result.id,
        notes: {
            bookingid: result.id,
            location: data.get('address') as string,
        },
        
    })

    if (!razorpayOrder) {
        throw new Error("Failed to create Razorpay order")
    }
    
    //console.log("HI");
    //console.log(razorpayOrder);
    
    
    // Redirect to Razorpay Checkout
    const headersData = await headers();

    const successUrl = `${headersData.get('origin')}/book/checkout/result?order_id=${razorpayOrder.id}`;
    const cancelUrl = `${headersData.get('origin')}`;

    // Razorpay checkout options
    const razorpayCheckoutOptions = {
        key: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: `Parking at ${data.get('address')}`,
        description: 'Complete your booking payment',
        order_id: razorpayOrder.id, // Razorpay order ID
        callback_url: successUrl, // Razorpay will send the response to this URL
        cancel_url: cancelUrl,
        notes: razorpayOrder.notes,
        prefill: {
            name: '',//user.firstName,
            email: ''//user.emailAddresses[0]?.emailAddress,
        },
        theme: {
            color: '#3399cc',
        },
    }

    // Redirect to Razorpay Checkout (simulating redirection here)
    redirect(`/book/checkout/razorpay?options=${encodeURIComponent(JSON.stringify(razorpayCheckoutOptions))}`)
}