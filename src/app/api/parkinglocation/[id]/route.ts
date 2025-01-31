import { NextRequest, NextResponse } from 'next/server';
import { ParkingLocationModel } from '@/schemas/parking-locations';
import {connectToDB} from '@/lib/db';
export async function GET(req: NextRequest) {
    console.log(req);
    console.log("HI");
    
    try {
        await connectToDB(); // Ensure database connection

        /*const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from URL

        if (!id) {
            return NextResponse.json({ error: 'Missing location ID' }, { status: 400 });
        }*/

        const location = await ParkingLocationModel.findById('67908b6e22a3365b3e9477f4').lean(); // Use lean() for performance

        if (!location) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: location }, { status: 200 });
    } catch (error) {
        console.error('Error fetching parking location:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
