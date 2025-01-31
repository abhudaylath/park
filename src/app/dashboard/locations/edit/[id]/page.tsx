import React from 'react';
import LocationEditForm from './location-edit-form';

async function fetchLocation(id: string) {
    try {
        console.log(id);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parkinglocation/${id}`);

        if (!response.ok) {
            throw new Error('Location not found');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

async function LocationEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    console.log("hi");
    
    
    const locationData = await fetchLocation(id);

    if (!locationData) {
        return <p>Location not found</p>;
    }

    return (
        <div>
            <LocationEditForm location={JSON.stringify(locationData.data)} id={id} />
        </div>
    );
}
export default LocationEditPage