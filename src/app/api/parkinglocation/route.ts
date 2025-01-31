import { connectToDB } from "@/lib/db";
import { ParkingLocationModel } from "@/schemas/parking-locations";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB(); 
        const location = await ParkingLocationModel.find({});
        //console.log(location);
        
        if (!location) {
            return NextResponse.json({ success: false, message: "Parking location not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, location }, { status: 200 });
    } catch (error) {
        console.error("Error fetching parking location:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}