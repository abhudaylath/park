'use client';

import { Switch } from '@/components/ui/switch';
import { ParkingLocationStatus } from '@/types';
import React, { useState } from 'react';

type SwitchProps = {
    id: string;
    name: string;
    status: string;
};

const LocationToggleSwitch: React.FC<SwitchProps> = ({ id, status, name }) => {
    const [isActive, setIsActive] = useState(status === ParkingLocationStatus.AVAILABLE);

    const handleToggleSwitch = async () => {
        try {
            const newStatus =
                isActive ? ParkingLocationStatus.NOTAVAILABLE : ParkingLocationStatus.AVAILABLE;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parking-locations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id:id,status: newStatus }),
            });
            //console.log(response);
            
            if (response.ok) {
                setIsActive(!isActive);
            } else {
                console.log('Failed to update status');
            }
        } catch (error) {
            console.error('Error toggling parking location status:', error);
        }
    };

    return (
        <div className={`flex justify-between ${isActive ? 'text-green-500' : 'text-gray-200'}`}>
            {name}
            <Switch checked={isActive} onClick={handleToggleSwitch} />
        </div>
    );
};

export default LocationToggleSwitch;
