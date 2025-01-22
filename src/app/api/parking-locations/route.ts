import { connectToDB } from "@/lib/db";
import { ParkingLocationModel } from "@/schemas/parking-locations";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Extract query parameters (latitude and longitude)
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Latitude and longitude are required.' }, { status: 400 });
        }

        // Convert lat and lng to numbers
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json({ error: 'Invalid latitude or longitude.' }, { status: 400 });
        }

        // Connect to the database
        await connectToDB();

        // Query to find locations within a 500m radius
        const locations = await ParkingLocationModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 500 / 6378137], // Radius in radians (500m ÷ Earth's radius in meters)
                },
            },
        });

        // Return the found locations
        return NextResponse.json({ success: true, locations }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
    }
}
