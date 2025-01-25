import { connectToDB } from "@/lib/db";
import { Booking, BookingModel } from "@/schemas/booking";
import { ParkingLocationModel } from "@/schemas/parking-locations";
import { ActionResponse } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import sendEmail from "@/lib/nodemailer";

export async function sendConfirmationEmail(bookingid: string): Promise<ActionResponse> {
    try {
        const user = await currentUser();
        if (!user || !user.firstName || !user.primaryEmailAddress?.emailAddress) {
            throw new Error("User is not logged in or missing required information");
        }

        await connectToDB();

        const booking = await BookingModel.findById<Booking>(bookingid).populate({
            path: "locationid",
            model: ParkingLocationModel,
        }).lean();

        if (booking) {
            // Ensure booking fields are valid
            const formattedBookingDate = booking.bookingdate
                ? formatDate(booking.bookingdate, "MMM dd, yyyy")
                : "Unknown";
            const formattedStartTime = booking.starttime
                ? formatDate(booking.starttime, "hh:mm a")
                : "Unknown";
            const formattedEndTime = booking.endtime
                ? formatDate(booking.endtime, "hh:mm a")
                : "Unknown";

            const emailHtml = `
                <html>
                  <body>
                    <h1>Hello ${user.firstName}</h1>
                    <p>Your booking has been confirmed!</p>
                    <p><strong>Booking Date:</strong> ${formattedBookingDate}</p>
                    <p><strong>Arriving On:</strong> ${formattedStartTime}</p>
                    <p><strong>Leaving On:</strong> ${formattedEndTime}</p>
                    <p><strong>Plate No:</strong> ${booking.plate}</p>
                    <p><strong>Address:</strong> ${booking.locationid.address}</p>
                  </body>
                </html>
            `;
            console.log("ehtml",emailHtml);
            
            /*const mailOptions = {
                from: '"Gateless Parking" <abhudaylath@gmail.com>',
                to: user.primaryEmailAddress.emailAddress,
                subject: "Your booking has been confirmed",
                html: emailHtml,
            };

            const info = await transporter.sendMail(mailOptions);*/
            const info = await sendEmail(user.primaryEmailAddress.emailAddress,emailHtml)
            console.log("Message sent: %s", info);

            return {
                code: 0,
                message: "Email sent successfully",
            };
        }

        return {
            code: 1,
            message: "Booking not found",
        };
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return {
            code: 2,
            message: "Failed to send email",
        };
    }
}
