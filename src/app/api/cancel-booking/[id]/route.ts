import { BookingModel } from "@/schemas/booking";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const deletedBooking = await BookingModel.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Booking:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}