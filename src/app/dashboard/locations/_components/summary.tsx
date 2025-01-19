import { Button } from '@/components/ui/button'
import { formatAmountForDisplay } from '@/lib/utils'
import { useMySpotStore } from '@/store'
import { ListSpotPropsType } from '@/types'
import React from 'react'

function Summary({
    onPrev
}: ListSpotPropsType) {

    const mySpotStore = useMySpotStore()
    const hourlyPrice = mySpotStore.data.price?.hourly

    return (
        <div className="grid w-full gap-1 5">
            <h2 className='text-xl sm:text-2xl py-4 font-semibold'>Summary</h2>
            <div className='flex flex-col gap-y-2 text-lg text-muted-foreground'>
                <p>{mySpotStore.data.address}</p>
                <p>Number of spot(s): {mySpotStore.data.numberofspots}</p>
                <p>Hourly: {hourlyPrice !== undefined ? formatAmountForDisplay(hourlyPrice, 'INR') : 'N/A'}</p>
            </div>

            <div className='flex justify-between items-center py-4'>
                <Button type='button' variant='ghost' onClick={onPrev}>Prev</Button>
            </div>
        </div>
    )
}

export default Summary