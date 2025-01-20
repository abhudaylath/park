import React from 'react'
import SidebarLayout from './_components/sidebar-layout'

function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='ml-64 '>
            <SidebarLayout>{ children }</SidebarLayout>
        </div>
    )
}

export default DashboardLayout