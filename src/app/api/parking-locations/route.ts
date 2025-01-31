import { connectToDB } from "@/lib/db";
import { BookingModel } from "@/schemas/booking";
import { ParkingLocation, ParkingLocationModel } from "@/schemas/parking-locations";
import { BookingStatus, ParkingLocationStatus } from "@/types";
import { NextResponse } from "next/server";
import { toast } from "sonner";

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
        const arrivingDate = new Intl.DateTimeFormat('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            hour12: false, 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date(arrivingOn)).split(", ")[0];
        
        const st = `${arrivingTime}:00`; // Ensure HH:mm format and add seconds
        const et = `${leavingTime}:00`;


        

        // Connect to the database
        await connectToDB();

        // Query to find locations within a 500m radius
        const locations = await ParkingLocationModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 500 / 6378137], // Radius in radians (500m ÷ Earth's radius in meters)
                },
            },
            status: ParkingLocationStatus.AVAILABLE,
        });

        const availableLocations = await Promise.all(
            locations.map(async (location: ParkingLocation) => {
                try {
                    const bookings = await BookingModel.find({
                        locationid: location._id,
                    }).lean();

                    const bookedSpotIds = new Set();
                    bookings.forEach(booking => {


                        const bookingStartDate = new Date(booking.starttime);
                        const bookingEndDate = new Date(booking.endtime);

                        const bookingStartDateIST = new Intl.DateTimeFormat('en-IN', { 
                            timeZone: 'Asia/Kolkata', 
                            hour12: false, 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(bookingStartDate);
                    
                        const bookingEndDateIST = new Intl.DateTimeFormat('en-IN', { 
                            timeZone: 'Asia/Kolkata', 
                            hour12: false, 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(bookingEndDate);

                        const bookingStartDateFormatted = bookingStartDateIST.split(', ')[0];
                        let  bookingStartTimeFormatted = bookingStartDateIST.split(', ')[1];
                        const bookingEndDateFormatted = bookingEndDateIST.split(', ')[0];
                        let  bookingEndTimeFormatted = bookingEndDateIST.split(', ')[1];

                        
                        /*const requestedStartDateIST = new Intl.DateTimeFormat('en-IN', { 
                            timeZone: 'Asia/Kolkata', 
                            hour12: false, 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(st);
                        

                        const requestedEndDateIST  = new Intl.DateTimeFormat('en-IN', { 
                            timeZone: 'Asia/Kolkata', 
                            hour12: false, 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(et);


                        const [requestedStartDateFormatted, requestedStartTimeFormatted] = requestedStartDateIST.split(' ');
                        const [requestedEndDateFormatted, requestedEndTimeFormatted] = requestedEndDateIST.split(' ');
*/
                        
                        
                        if(bookingStartTimeFormatted==='24:00:00'){
                            bookingStartTimeFormatted='00:00:00'
                        }

                        if(bookingEndTimeFormatted==='24:00:00'){
                            bookingEndTimeFormatted='00:00:00'
                        }
                        
                        if (
                            booking.status === BookingStatus.BOOKED &&
                            bookingStartDateFormatted === arrivingDate &&
                            bookingEndDateFormatted === arrivingDate
                        ) {
                            if (
                                (bookingStartTimeFormatted <= st && bookingEndTimeFormatted > st) || // Overlaps start
                                (bookingStartTimeFormatted < et && bookingEndTimeFormatted >= et) || // Overlaps end
                                (st <= bookingStartTimeFormatted && et >= bookingEndTimeFormatted) || // Encloses booking
                                (st >= bookingStartTimeFormatted && et <= bookingEndTimeFormatted) // Enclosed by booking
                            ) {
                                bookedSpotIds.add(booking); 
                            }
                        }
                        

                    });

                    const usedSpots = bookedSpotIds.size;

                    if (usedSpots < location.numberofspots) {
                        return {
                            ...location,
                            bookedspots: usedSpots,
                        };
                    } else {
                        return {
                            ...location,
                            bookedspots: usedSpots,
                            status: ParkingLocationStatus.FULL,
                        };
                    }
                } catch {
                    //console.log(`Error processing location ${arrivingTime}:`, err);
                    toast.error(`Error processing location ${arrivingTime}:`)
                    return { ...location, status: 'ERROR_PROCESSING' };
                }
            }) 
        );

        // Return the found locations
        return NextResponse.json({ success: true, locations: availableLocations }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
    }
}