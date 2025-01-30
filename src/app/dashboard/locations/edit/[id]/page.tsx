import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';

// Removed 'async' from the page component
export default function LocationEditPage({
    params
}: { params: { id: string } }) {
    const { id } = params;  // Directly access params without async/await
    
    // Perform async operation inside useEffect or directly in try/catch for async
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
