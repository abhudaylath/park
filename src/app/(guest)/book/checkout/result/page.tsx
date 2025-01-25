import { connectToDB } from "@/lib/db";
import { Booking, BookingModel } from "@/schemas/booking";
import { ParkingLocation, ParkingLocationModel } from "@/schemas/parking-locations";
import { formatDate } from "date-fns";
import { BookingStatus } from "@/types";
import React from "react";
import { CheckCircle2 } from "lucide-react";
//import { sendConfirmationEmail } from "@/actions/actions";
//import { currentUser } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import Footer from "@/components/footer";
import { sendConfirmationEmail } from "@/actions/send-confirmation-email";
import { currentUser } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function BookingCheckoutResultPage({ searchParams }: { searchParams: { order_id: string } }) {
    const { order_id } = await searchParams;

    // Get the user
    const user = await currentUser();

    if (!order_id) {
        throw new Error("Invalid order ID");
    }

    if (!user) {
        throw new Error("You must be logged in");
    }

    // Retrieve Razorpay order details
    const orderDetails = await razorpay.orders.fetch(order_id);

    if (!orderDetails) {
        throw new Error("Order not found");
    }

    const paymentStatus = orderDetails.status === "paid" ? "Payment Successful" : "Payment Failed";

    let address = "";
    let date = "";
    let arrivingon = "";
    let leavingon = "";
    let plate = "";

    if (orderDetails.status === "paid") {
        const bookingid = String(orderDetails.notes?.bookingid||"");
        
        await connectToDB();

        const booking = await BookingModel.findById<Booking>(bookingid).populate({
            path: "locationid",
            model: ParkingLocationModel,
        });

        if (booking) {
            address = ((booking?.locationid as object) as ParkingLocation).address;
            date = formatDate(booking?.bookingdate, "MMM dd, yyyy");
            arrivingon = formatDate(booking?.starttime, "hh:mm a");
            leavingon = formatDate(booking?.endtime, "hh:mm a");
            plate = booking.plate;

            if (booking.status === BookingStatus.PENDING) {
                booking.status = BookingStatus.BOOKED;
                booking.stripesessionid = order_id;

                await booking.save();

                await sendConfirmationEmail(bookingid);
            }
        }
    }

    return (
        <>
            {orderDetails.status === "paid" ? (
                <div>
                    <main className="sm:container flex flex-col items-center pt-16">
                        <CheckCircle2 size={64} className="text-green-500" />
                        <p className="font-medium text-primary text-2xl sm:text-4xl py-8">Thank you!</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                            Your booking has been confirmed.
                        </h1>
                        <p className="mt-2 sm:text-base text-zinc-700 py-4 text-xl">Here are your booking details:</p>

                        <div className="flex flex-col items-center p-1 sm:p-0 w-2/3">
                            <div className="flex gap-x-4 w-full">
                                <p className="flex text-zinc-700 w-1/3 justify-end">Parking at:</p>
                                <p className="text-zinc-700 w-1/2">{address}</p>
                            </div>
                            <div className="flex gap-x-4 w-full">
                                <p className="flex text-zinc-700 w-1/3 justify-end">Arriving on:</p>
                                <p className="text-zinc-700 w-1/2">{date} {arrivingon}</p>
                            </div>
                            <div className="flex gap-x-4 w-full">
                                <p className="flex text-zinc-700 w-1/3 justify-end">Leaving on:</p>
                                <p className="text-zinc-700 w-1/2">{date} {leavingon}</p>
                            </div>
                            <div className="flex gap-x-4 w-full">
                                <p className="flex text-zinc-700 w-1/3 justify-end">Plate no:</p>
                                <p className="text-zinc-700 w-1/2 justify-center">{plate.toUpperCase()}</p>
                            </div>

                        </div>
                        <p className="mt-2 sm:text-base text-zinc-500 py-16 text-xl">
                            We have also sent you an email with the details.
                        </p>
                    </main>
                    <Footer />
                </div>
            ) : (
                paymentStatus
            )}
        </>
    );
}

export default BookingCheckoutResultPage;
