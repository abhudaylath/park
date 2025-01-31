"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/locations/tileview');
    }, [router]); // Run once after mount

    return <div>Redirecting...</div>;
}

export default DashboardPage;
