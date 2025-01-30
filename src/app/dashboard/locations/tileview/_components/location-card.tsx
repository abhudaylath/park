import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LocationToggleSwitch from "./location-enable-switch"
import { formatAmountForDisplay } from "@/lib/utils"
import LocationDeleteButton from "./location-delete-button"
import Link from "next/link"
import { PencilIcon } from "lucide-react"

type Props = {
    id: string,
    name: string,
    address: string,
    numberOfSpots: number,
    status: string,
    price: {
        hourly: number
    }
}

const LocationCard: React.FC<Props> = ({
    id, name, address, numberOfSpots, status, price
}) => {
//console.log(name);

    return (
        <Card className="w-full h-80 overflow-auto">
            <CardHeader>
                <CardTitle>
                    {<LocationToggleSwitch id={id} name={name} status={status} />}
                </CardTitle>
                <CardDescription className="text-md">{address}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-1 items-start ">
                    <div className="space-y-2">
                        <p className="text-sm font-medium leading-none">Hourly price: {formatAmountForDisplay(price.hourly, 'INR')}</p>
                        <p className="text-sm font-medium leading-none">Number of spots: {numberOfSpots}</p>
                        <hr />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-between">
                    <LocationDeleteButton id={id}/>
                    <Link href={`./edit/${id}`} >
                        <PencilIcon className='w-4 h-4' color="blue" />
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LocationCard