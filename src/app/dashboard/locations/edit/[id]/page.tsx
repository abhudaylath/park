import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';
import mongoose from 'mongoose';

// Export a server component for the page
export default async function LocationEditPage({
    params,
}: {
    params: { id: string }; // Correctly typed params
}) {
    const { id } = params;

    try {
        // Fetch location data from the database
        const location = await ParkingLocationModel.findById<ParkingLocation>(new mongoose.Types.ObjectId(id));

        if (!location) {
            return <p>Location not found</p>;
        }

        return (
            <div>
                <h1>Edit Parking Location</h1>
                <LocationEditForm location={JSON.stringify(location)} id={id} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching location:', error);
        return <p>Error loading location data</p>;
    }
}
