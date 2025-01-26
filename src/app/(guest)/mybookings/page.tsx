import { connectToDB } from '@/lib/db';
import { getStreetFromAddress } from '@/lib/utils';
import { Booking, BookingModel } from '@/schemas/booking';
import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import { BookingStatus } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import React from 'react';

async function MyBookingsPage() {
    const authResult = await auth(); // Await the promise to resolve
    const { userId } = authResult;

    if (!userId) {
        await authResult.redirectToSignIn({ returnBackUrl: '/mybookings' });
        return null; // Ensure the component renders nothing while redirecting
    }

    await connectToDB();

    const bookings: Booking[] = await BookingModel.find({
        userid: userId,
    }).populate({
        path: 'locationid',
        model: ParkingLocationModel,
    });

    return (
        <div className="-mt-16 p-4">
            <div className="sm:container bg-gray-50 shadow">
                <header className="text-2xl sm:text-4xl text-center w-full p-4">My Bookings</header>
                <hr />
                {bookings.map((booking) => (
                    <div key={booking.id}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 p-2 items-center">
                            <div className="flex flex-col space-y-1 items-start">
                                <p className="text-sm text-slate-400">{booking.status}</p>
                                <p className="text-xl font-bole">
                                    {getStreetFromAddress(
                                        ((booking.locationid as unknown) as ParkingLocation).address
                                    )}
                                </p>
                                <p className="text-sm">
                                    {format(booking.bookingdate, 'MMM, dd yyy')}
                                </p>
                                <p className="text-sm">
                                    {format(booking.starttime, 'hh:mm a')} -{' '}
                                    {format(booking.endtime, 'hh:mm a')}
                                </p>
                            </div>
                            {booking.status === BookingStatus.BOOKED && (
                                <div className="flex sm:flex-col sm:space-y-2 items-end">
                                    <button className="text-red-500">Cancel</button>
                                    <button className="text-blue-500">Edit</button>
                                </div>
                            )}
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBookingsPage;
