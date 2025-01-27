import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAmountForDisplay, getStreetFromAddress } from '@/lib/utils'
import { ParkingLocationModel } from '@/schemas/parking-locations'
import React from 'react'

async function RevenuePage() {

    const locations = await ParkingLocationModel.aggregate([
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'locationid',
                as: 'bookings'
            }
        },
        {
            $addFields: {
                totalAmount: { $sum: '$bookings.amount' },
                bookedCount: {
                    $size: {
                        $filter: {
                            input: '$bookings',
                            as: 'booking',
                            cond: { $eq: ['$$booking.status', 'BOOKED'] }
                        }
                    }
                },
                cancelledCount: {
                    $size: {
                        $filter: {
                            input: '$bookings',
                            as: 'booking',
                            cond: { $eq: ['$$booking.status', 'CANCELLED'] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                address: 1,
                totalAmount: 1,
                bookedSpots: 1,
                bookedCount: 1,
                cancelledCount: 1
            }
        }
    ])


    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2 p-2">
    {
        locations.map(location => (
            <Card key={location._id} className="w-full flex flex-col">
                <CardHeader>
                    <CardTitle>
                        {getStreetFromAddress(location.address)}
                    </CardTitle>
                    <CardDescription className="text-md text-green-400">
                        Booked {location.bookedCount}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between">
                    <div className="mt-auto">
                        <p className="text-lg font-medium leading-none">
                            Revenue: {formatAmountForDisplay(location.totalAmount, 'INR')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        ))
    }
</div>

    )
}

export default RevenuePage