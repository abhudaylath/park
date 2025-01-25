import { connectToDB } from "@/lib/db";
import { BookingModel } from "@/schemas/booking";
import { ParkingLocation, ParkingLocationModel } from "@/schemas/parking-locations";
import { BookingStatus, ParkingLocationStatus } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Extract query parameters (latitude and longitude)
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const arrivingOn = searchParams.get('arrivingon');
        const arrivingTime = searchParams.get('arrivingtime');
        const leavingTime = searchParams.get('leavingtime');

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Latitude and longitude are required.' }, { status: 400 });
        }

        if (!arrivingOn || !arrivingTime || !leavingTime) {
            return NextResponse.json({ error: 'Invalid or missing date/time parameters.' }, { status: 400 });
        }

        // Convert lat and lng to numbers
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json({ error: 'Invalid latitude or longitude.' }, { status: 400 });
        }

        const st = new Date(arrivingOn); // Use arrivingOn directly
        const et = new Date(`${arrivingOn.split('T')[0]}T${leavingTime}`); // Combine the date part of arrivingOn with leavingTime


        if (isNaN(st.getTime()) || isNaN(et.getTime())) {
            return NextResponse.json({ error: 'Invalid date/time values.' }, { status: 400 });
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
        
        const availableLocations = await Promise.all(
            locations.map(async (location: ParkingLocation) => {
                try {
                    const bookings = await BookingModel.find({
                        locationid: location._id,
                        status: BookingStatus.BOOKED,
                        $or: [
                            { starttime: { $lt: et, $gte: st } },
                            { endtime: { $lte: et, $gt: st } },
                            { starttime: { $lte: st }, endtime: { $gte: et } },
                            { starttime: { $gte: st }, endtime: { $lte: et } },
                        ]
                    }).lean();                   
                    
                    if (bookings.length < location.numberofspots) {
                        return { ...location, bookedspots: bookings.length };
                    } else {
                        return { ...location, bookedspots: bookings.length, status: ParkingLocationStatus.FULL };
                    }
                } catch (err) {
                    console.log(`Error processing location ${arrivingTime}:`, err);
                    return { ...location, status: 'ERROR_PROCESSING' };
                }
            })
        );
        
        // Return the found locations
        return NextResponse.json({ success: true,locations: availableLocations }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
    }
}