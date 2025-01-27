import { connectToDB } from "@/lib/db";
import { BookingModel } from "@/schemas/booking";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const date = searchParams.get("date");
        const status = searchParams.get("status");
        /*console.log(id);
        console.log(date);
        console.log(status);*/
        
        if (!id || !date || !status) {
            return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
        }

        await connectToDB();
        const Booking = await BookingModel.find({
            locationid:id,
            status:status
        });
        if (!Booking ) {
            return NextResponse.json(
                { success: false, message: "Parking Booking not found" },
                { status: 404 }
            );
        }
        const providedDate = new Date(date);
        const modifiedBooking = Booking.filter((booking) => {
            const bookingDateIST = new Date(booking.bookingdate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const providedDateIST = new Date(providedDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            //console.log(bookingDateIST);
            //console.log(providedDateIST);
            
            return bookingDateIST.split(",")[0] === providedDateIST.split(",")[0]; // Compare dates by YYYY-MM-DD
        }).map((booking) => ({
            ...booking.toObject(), // Include all booking properties
        }));
        
        //console.log(modifiedBooking);
        
        
        if (!modifiedBooking) {
            return NextResponse.json({ success: false, message: "Parking Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, modifiedBooking }, { status: 200 });
    } catch (error) {
        console.error("Error fetching parking Booking:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}