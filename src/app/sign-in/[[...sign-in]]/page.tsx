'use client'

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center pt-12">
            <SignIn />
        </div>

    )
}