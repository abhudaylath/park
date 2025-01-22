import React from 'react'
import LocationsTileViewPage from './locations/tileview/page'
import AddLocationButton from './locations/_components/add-location-button'
import { Separator } from '@/components/ui/separator'

function DashboardPage() {
    return (
        <div>
            <AddLocationButton />
            <Separator className='bg-blue-400 w-full my-4' />
            <LocationsTileViewPage/>
        </div>
    )
}

export default DashboardPage