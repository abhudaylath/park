import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export default async function LocationEditPage({
    params,
}: {
    params: { id: string };
}) {
    const id = new mongoose.Types.ObjectId(params.id);

    try {
        const location = await ParkingLocationModel.findById<ParkingLocation>(id);

        if (!location) {
            return <p>Location not found</p>;
        }

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
