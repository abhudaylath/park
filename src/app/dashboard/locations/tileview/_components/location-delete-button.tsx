'use client'

import ConfirmationDialog from '@/components/confirmation-dialog'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    id: string,
}
const LocationDeleteButton: React.FC<Props> = ({ id }) => {

    //const { id } = JSON.parse(props) as Props
    const [open, setOpen] = useState(false)
    const router= useRouter();
    const handleConfirm = async () => {
        setOpen(false)
        const response = await fetch(`/api/parking-locations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });
        if (response.ok) {
            router.refresh();
        } else {
            console.log('Failed to update status');
        }
    }
    return (
        <>
            {
                <Button variant="ghost" onClick={() => setOpen(true)}>
                    <Trash2Icon color='red' className='mb-5' />
                </Button>
            }

            <ConfirmationDialog
                message='By continuing you are going to delete the location?'
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm} />
        </>
    )
}

export default LocationDeleteButton