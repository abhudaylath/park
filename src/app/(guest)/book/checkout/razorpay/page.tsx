'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface RazorpayPrefill {
    name?: string;
    email?: string;
    contact?: string;
}

interface RazorpayTheme {
    color?: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id?: string;
    handler: (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
    prefill?: RazorpayPrefill;
    notes?: Record<string, string>;
    theme?: RazorpayTheme;
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

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
                    try {
                        const parsedOptions: RazorpayOptions = JSON.parse(decodeURIComponent(options));
                        const razorpay = new window.Razorpay(parsedOptions);
                        razorpay.open();
                    } catch (error) {
                        console.error('Error parsing Razorpay options:', error);
                    }
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
