"use client"
import { LatLng } from '@/types'
import React, { useEffect, useRef } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { libs } from '@/lib/utils'
import { Input } from './ui/input'

type AddressAutoCompleteInputProps = {
    onAddressSelect: (address: string, gpscoords: LatLng) => void,
    selectedAddress?: string
}

function AddressAutoCompleteInput({
    onAddressSelect, selectedAddress
}: AddressAutoCompleteInputProps) {

    const { isLoaded } = useJsApiLoader({
        nonce: "477d4456-f7b5-45e2-8945-5f17b3964759",
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
        libraries: libs
    })

    const placesAutoCompleteRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isLoaded) {
            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng({ lat: 19.161733046075117, lng: 72.82921419960786 }), // SW
                new google.maps.LatLng({ lat: 19.189112725700344, lng: 72.87677903749488 })  // NE
            )
            /*important part */
            const autoComplete = new google.maps.places.Autocomplete(placesAutoCompleteRef.current as HTMLInputElement, {
                bounds: bounds,
                fields: ['formatted_address', 'geometry','name','adr_address'],
                componentRestrictions: { country: ['in'] }
            })

            autoComplete.addListener('place_changed', () => {
                const place = autoComplete.getPlace()
                //console.log(place.adr_address);
                const updated_place = place.name+", "+place.formatted_address;
                if (place.formatted_address && place.geometry?.location) {
                    onAddressSelect(updated_place, {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    })
                } else {
                    console.warn('Place details not available', place)
                }
            })
        }
    }, [isLoaded, onAddressSelect])

    useEffect(() => {
        setTimeout(() => (document.body.style.pointerEvents = ""), 0)
    }, [])

    return (
        <Input ref={placesAutoCompleteRef} defaultValue={selectedAddress} />
    )
}

export default AddressAutoCompleteInput
