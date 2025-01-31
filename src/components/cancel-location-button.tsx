'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { BanIcon } from 'lucide-react'
import ConfirmationDialog from './confirmation-dialog'
import { useRouter } from 'next/navigation'

function CancelBookingButton({
    param
}: { param: string }) {

    const bookingid = param
    const [isPending, setPending] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const handleCancelBooking = () => {
        setOpen(true)
    }

    const handleConfirm = async () => {
        setOpen(false)
        setPending(false)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cancel-booking/${bookingid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: bookingid }),
        });
        if (response.ok) {
            router.refresh();
        } else {
            console.log('Failed to update status');
        }
    }

    return (
        <>
            {isPending ? 'Cancelling...' :
                <Button className='w-[100px]' variant='outline' onClick={handleCancelBooking}>
                    <BanIcon className='text-red-500 mr-2 h-4 w-4' /> Cancel
                </Button>
            }
            <ConfirmationDialog
                message='By continuing you are going to cancel the booking?'
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm} />

        </>
    )
}

export default CancelBookingButton