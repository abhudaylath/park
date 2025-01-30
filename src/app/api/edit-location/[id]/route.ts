import { ParkingLocationModel } from "@/schemas/parking-locations";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        // Extract the ID from the request URL
        const { pathname } = new URL(request.url);
        const id = pathname.split("/").pop(); // Extracts the last segment (ID)

        if (!id) {
            return NextResponse.json({ error: "Parking location ID is required" }, { status: 400 });
        }

        const body = await request.json(); // Parse the request body
        const { hourly, numberofspots } = body;

        if (hourly === undefined) {
            return NextResponse.json({ error: "Missing 'hourly' in the request" }, { status: 400 });
        }
        if (numberofspots === undefined) {
            return NextResponse.json({ error: "Missing 'numberofspots' in the request" }, { status: 400 });
        }

        const updatedLocation = await ParkingLocationModel.findByIdAndUpdate(
            id,
            { "price.hourly": hourly, numberofspots },
            { new: true }
        );

        if (!updatedLocation) {
            return NextResponse.json({ error: "Parking location not found" }, { status: 404 });
        }

        return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
        console.error("Error updating parking location:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
