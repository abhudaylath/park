"use server"
import EmailTemplate from "@/components/email-template";
import { renderToStaticMarkup } from "react-dom/server";

interface EmailTemplateProps {
    firstName: string;
    bookingDate: string;
    arrivingOn: string;
    leavingOn: string;
    plateNo: string;
    address: string;
}

export async function renderEmailTemplate(props: EmailTemplateProps): Promise<string> {
    const{firstName,
        bookingDate,
        arrivingOn,
        leavingOn,
        plateNo,
        address,}=await props;
        const formatedEmail = EmailTemplate({
            firstName: firstName,
            bookingDate: bookingDate,
            arrivingOn: arrivingOn,
            leavingOn: leavingOn,
            plateNo: plateNo,
            address: address
        })

    return(
        renderToStaticMarkup(formatedEmail)
    );
}