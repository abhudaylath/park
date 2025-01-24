'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RazorpayCheckout() {
    const searchParams = useSearchParams();
    const options = searchParams.get('options');

    useEffect(() => {
        const loadRazorpayScript = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                if (options) {
                    const parsedOptions = JSON.parse(decodeURIComponent(options));
                    const razorpay = new (window as any).Razorpay(parsedOptions);
                    razorpay.open();
                }
            };
            script.onerror = () => {
                console.error('Failed to load Razorpay script.');
            };
            document.body.appendChild(script);
        };

        loadRazorpayScript();
    }, [options]);

    return (
        <div>
            <h1>Redirecting to Razorpay Checkout...</h1>
        </div>
    );
}
