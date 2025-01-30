import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';

async function LocationEditPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    try {
        const location = await ParkingLocationModel.findById<ParkingLocation>(id);

        if (!location) {
            return <p>Location not found</p>;
        }

        return (
            <div>
                <LocationEditForm location={JSON.stringify(location)} id={params.id} />
            </div>
        );
    } catch {
        return <p>Error loading location data</p>;
    }
}
export default LocationEditPage