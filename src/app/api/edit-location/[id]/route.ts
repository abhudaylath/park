import { ParkingLocationModel } from "@/schemas/parking-locations";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {

    const { id } = await params;
    try {
        const body = await request.json(); // Parse the request body
        const { hourly,numberofspots } = body;
        if (!hourly) {
            return NextResponse.json({ error: 'Missing status in the request' }, { status: 400 });
        }
        if (!numberofspots) {
            return NextResponse.json({ error: 'Missing status in the request' }, { status: 400 });
        }
        const updatedLocation = await ParkingLocationModel.findByIdAndUpdate(
            id,
            { 'price.hourly': hourly,
                numberofspots
            },
            { new: true }
        );

        if (!updatedLocation) {
            return NextResponse.json({ error: 'Parking location not updated' }, { status: 404 });
        }

        return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
        console.error('Error updating parking location:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}