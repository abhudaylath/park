import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';

export default async function LocationEditPage({
    params
}: { params: { id: string } }) {
    const { id } = await params;
    
    try {
        const location = await ParkingLocationModel.findById<ParkingLocation>(id);
        
        if (!location) {
            // Handle the case where the location is not found
            return <p>Location not found</p>;
        }

        return (
            <LocationEditForm location={JSON.stringify(location)} id={id} />
        );
    } catch (error) {
        console.error('Error fetching location:', error);
        // Render an error message or a fallback UI
        return <p>Error loading location data</p>;
    }
}
