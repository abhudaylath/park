import { connectToDB } from '@/lib/db';
import { ParkingLocationModel } from '@/schemas/parking-locations';
import { NextRequest, NextResponse } from 'next/server';

// PUT - Update a parking location
export async function PUT(request: NextRequest) {
    const { pathname } = new URL(request.url); // Extract URL path
    const id = pathname.split("/").pop(); // Extract the last part (ID)

    try {
        if (!id) {
            return NextResponse.json({ error: 'Missing parking location ID' }, { status: 400 });
        }

        const body = await request.json(); // Parse the request body
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Missing status in the request' }, { status: 400 });
        }

        const updatedLocation = await ParkingLocationModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedLocation) {
            return NextResponse.json({ error: 'Parking location not found' }, { status: 404 });
        }

        return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
        console.error('Error updating parking location:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a parking location
export async function DELETE(request: NextRequest) {
    const { pathname } = new URL(request.url); // Extract URL path
    const id = pathname.split("/").pop(); // Extract the last part (ID)
    const body = await request.json(); 
    console.log("Request Body:", body);
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Missing parking location ID' }, { status: 400 });
        }

        const deletedLocation = await ParkingLocationModel.findByIdAndDelete(id);

        if (!deletedLocation) {
            return NextResponse.json({ error: 'Parking location not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Parking location deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting parking location:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    
    try {
        if (!id) {
            return NextResponse.json({ error: 'Missing parking location ID' }, { status: 400 });
        }

        await connectToDB();
        const location = await ParkingLocationModel.findById(id);

        if (!location) {
            return NextResponse.json({ success: false, message: "Parking location not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, location }, { status: 200 });
    } catch (error) {
        console.error("Error fetching parking location:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
