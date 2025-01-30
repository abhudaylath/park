import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';
import mongoose from 'mongoose';

export default async function LocationEditPage({
    params,
}: {
    params: { id: string };
}) {
    try {
        // Validate and convert the string ID to MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(params.id);
        
        // Fetch location document
        const location = await ParkingLocationModel.findById<ParkingLocation>(objectId);
        
        if (!location) {
            return <p>Location not found</p>;
        }

        return (
            <div>
                <h1>Edit Parking Location</h1>
                <LocationEditForm location={JSON.stringify(location)} id={params.id} />
            </div>
        );
    } catch (error) {
        console.error('Error loading location:', error);
        return <p>Error loading location data</p>;
    }
}