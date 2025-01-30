import { BookingModel } from "@/schemas/booking";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        // Extract the booking ID from the request URL
        const { pathname } = new URL(request.url);
        const id = pathname.split("/").pop(); // Extracts the ID from the URL

        if (!id) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        const deletedBooking = await BookingModel.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Booking:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
