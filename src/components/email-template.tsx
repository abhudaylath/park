interface EmailTemplateProps {
    firstName: string;
    bookingDate: string;
    arrivingOn: string;
    leavingOn: string;
    plateNo: string;
    address: string;
}

export function EmailTemplate(props: EmailTemplateProps): string {
    const {
        firstName,
        bookingDate,
        arrivingOn,
        leavingOn,
        plateNo,
        address,
    } = props;

    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Your parking reservation receipt</title>
                <style>
                    body {
                        background-color: #ffffff;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    }
                    .container {
                        margin: 10px auto;
                        width: 600px;
                        max-width: 100%;
                        border: 1px solid #E5E5E5;
                    }
                    h1 {
                        font-size: 36px;
                        line-height: 1.3;
                        color: #747474;
                        font-weight: 700;
                        text-align: center;
                    }
                    .text {
                        font-size: 22px;
                        padding: 20px;
                        line-height: 1.3;
                        color: #808080;
                    }
                    .bold {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .button {
                        border: 1px solid #929292;
                        font-size: 16px;
                        text-decoration: none;
                        padding: 10px 0px;
                        width: 220px;
                        display: block;
                        text-align: center;
                        font-weight: 500;
                        color: #000;
                        margin: 20px auto;
                    }
                    .footer {
                        font-size: 13px;
                        color: #AFAFAF;
                        text-align: center;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>ParkFinder</h1>
                    <hr />
                    <p class="text">Hi ${firstName},</p>
                    <p class="text">Thank you for booking a spot with us!</p>
                    <p class="text">Parking at: ${address}</p>

                    <div style="padding: 22px 40px; background-color: #F7F7F7;">
                        <p><span class="bold">Booking date:</span> ${bookingDate}</p>
                        <p><span class="bold">Arriving on:</span> ${arrivingOn}</p>
                        <p><span class="bold">Leaving on:</span> ${leavingOn}</p>
                        <p><span class="bold">Plate #:</span> ${plateNo}</p>
                        <a href="http://localhost:3000/mybookings" class="button">My bookings</a>
                    </div>

                    <div class="footer">
                        <p>Web Version | Privacy Policy</p>
                        <p>
                            Please contact us if you have any questions.
                            (If you reply to this email, we won't be able to see it.)
                        </p>
                        <p>© 2024 ParkFinder, Inc. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}
