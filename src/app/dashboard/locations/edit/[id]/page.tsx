import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';
import mongoose from 'mongoose';

export default function LocationEditPage({
    params,
}: {
    params: { id: string };
}) {
    const objectId = new mongoose.Types.ObjectId(params.id);

    try {
        const fun = async () =>{
            const location = await ParkingLocationModel.findById<ParkingLocation>(objectId);
        
            if (!location) {
                return <p>Location not found</p>;
            }
    
        }
        fun()
        return (
            <div>
                <h1>Edit Parking Location</h1>
                <LocationEditForm location={JSON.stringify(location)} id={params.id} />
            </div>
        );
    } catch {
        return <p>Error loading location data</p>;
    }
}
