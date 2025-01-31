import React, { useCallback, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMySpotStore } from '@/store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import SpotAddress from './spot-address'
import NumberOfSpots from './number-of-spots'
import Pricing from './pricing'
import Summary from './summary'
import { toast } from 'sonner'

const totalSteps = 4
const stepIncrement = 100 / totalSteps

type Props = {
    id?: string | null,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddLocationDialog({ id = null, open, setOpen }: Props) {
    const [step, setStep] = useState(1)
    const restart = useMySpotStore((state) => state.restart) // Extract restart method from Zustand
    const data = useMySpotStore((state) => state.data) // Optional: extract data if used
    const router = useRouter()

    const restartStore = useCallback(() => {
        restart()
    }, [restart])

    useEffect(() => {
        setStep(1)

        const fetchData = () => {
            // Fetch logic here (e.g., fetch spot details if `id` is provided)
        }

        if (id && open) {
            fetchData()
        } else if (open) {
            restartStore()
        }
    }, [id, open, restartStore])

    const handleListAnother = () => {
        setStep(1)
        restart()
    }

    const handleFinalSubmit = async () => {
        const formData = new FormData()
        const modifiedData = {
            ...data, // Spread existing properties
            bookedspots: 0, // Add `bookedspots` with value `0`
        }

        formData.set('data', JSON.stringify(modifiedData))

        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parkinglocation/new`, {
            method: 'POST',
            body: formData,
        })

        if (result.ok) {
            toast.success("Record created")
            setOpen(false)
            router.replace('/dashboard/locations/tileview')
        } else {
            toast.error("Failed to create the parking location")
        }
    }

    const handleNextStepChange = () => {
        if (step < totalSteps) {
            setStep((currentStep) => currentStep + 1)
        }
    }

    const handlePrevStepChange = () => {
        if (step > 1) {
            setStep((currentStep) => currentStep - 1)
        }
    }

    const handleOnInteractOutside = (e: Event) => {
        const classes: string[] = []

        e.composedPath().forEach((el) => {
            if (el instanceof Element) {
                classes.push(...el.classList)
            }
        })

        if (classes.join("-").includes("pac-container")) {
            e.preventDefault()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={handleOnInteractOutside}>
                <DialogHeader>
                    <DialogTitle>List your spot</DialogTitle>
                    <div className="space-y-8">
                        <Progress value={step * stepIncrement} />
                        {{
                            1: <SpotAddress onNext={handleNextStepChange} />,
                            2: <NumberOfSpots onNext={handleNextStepChange} onPrev={handlePrevStepChange} />,
                            3: <Pricing onNext={handleNextStepChange} onPrev={handlePrevStepChange} />,
                            4: <Summary onNext={handleNextStepChange} onPrev={handlePrevStepChange} />,
                        }[step]}
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <div
                        className={`${step < totalSteps ? 'hidden' : 'flex flex-col mt-4 w-full space-y-2'}`}
                    >
                        <Button type="button" onClick={handleFinalSubmit}>
                            Submit
                        </Button>
                        <Button type="button" variant="outline" onClick={handleListAnother}>
                            List another
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddLocationDialog
