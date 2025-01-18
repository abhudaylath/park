import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet"
import Sidebar from '@/components/sidebar'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
function MobileSidebar({ open, setOpen }: {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) {
    return (
        <div >
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className='p-0 w-[256px]'>
                    <VisuallyHidden>
                        <SheetTitle>Your Hidden Title</SheetTitle>
                    </VisuallyHidden>
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileSidebar