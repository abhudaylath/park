'use client'

import { buildMapInfoCardContent, buildMapInfoCardContentForDestination, destinationPin, getStreetFromAddress, libs, parkingPin, parkingPinWithIndex } from "@/lib/utils"
import { MapAddressType, MapParams } from "@/types"
import { useJsApiLoader } from "@react-google-maps/api"
import { useEffect, useRef, useCallback } from "react"

function Map({ mapParams }: { mapParams: string }) {
    const params = JSON.parse(mapParams) as MapParams[];
    
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null); // Store infoWindow in useRef
    const mapRef = useRef<HTMLDivElement>(null);

    const { isLoaded } = useJsApiLoader({
        nonce: "477d4456-f7b5-45e2-8945-5f17b3964759",
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: libs
    });

    const getPinType = (loc: MapParams): string => {
        return loc.type === MapAddressType.DESTINATION ? 'parking_destination_tr' : 'parking_pin_tr';
    };

    // useCallback to keep setMarker stable
    const setMarker = useCallback((map: google.maps.Map) => {
        if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow({ maxWidth: 200 });
        }

        params.forEach((loc, index) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: loc.gpscoords,
                title: loc.address
            });

            if (loc.type === MapAddressType.PARKINGLOCATION || loc.type === MapAddressType.ADMIN) {
                marker.setAttribute("content", buildMapInfoCardContent(
                    getStreetFromAddress(loc.address),
                    loc.address,
                    loc.numberofspots as number,
                    loc.price?.hourly as number
                ));
                marker.content = loc.type === MapAddressType.PARKINGLOCATION
                    ? parkingPinWithIndex(getPinType(loc), index).element
                    : parkingPin(getPinType(loc)).element;
            } else {

                const cityCircle = new google.maps.Circle({
                    strokeColor: '#00FF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#0FF000',
                    fillOpacity: 0.35,
                    map,
                    center: {
                        lat: params[0].gpscoords.lat,
                        lng: params[0].gpscoords.lng
                    },
                    radius: loc.radius
                })


                marker.content = destinationPin(getPinType(loc)).element;
                marker.setAttribute("content", buildMapInfoCardContentForDestination(
                    getStreetFromAddress(loc.address),
                    loc.address
                ));
            }

            marker.addListener('click', () => {
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                    infoWindowRef.current.setContent(marker.getAttribute('content') || '');
                    infoWindowRef.current.open({
                        map,
                        anchor: marker
                    });
                }
            });
        });
    }, [params]);

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const mapOptions = {
                center: {
                    lat: params[0].gpscoords.lat,
                    lng: params[0].gpscoords.lng
                },
                zoom: 16,
                mapId: 'MY-MAP-ID-1234'
            };

            const gMap = new google.maps.Map(mapRef.current, mapOptions);
            setMarker(gMap);
        }
    }, [isLoaded, params, setMarker]);

    return (
        <div className="flex flex-col space-y-4">
            {isLoaded ? <div style={{ height: '600px' }} ref={mapRef} /> : <p>Loading...</p>}
        </div>
    );
}

export default Map;
