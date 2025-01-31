import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/mybookings(.*)",
    "/book/(.*)",
]);

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId, redirectToSignIn, sessionClaims } = await auth();

    // Redirect unauthenticated users to sign-in page before reaching a 404
    if (!userId && (isProtectedRoute(req) || isAdminRoute(req))) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Handle admin routes properly
    if (userId && isAdminRoute(req)) {
        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse(
                `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Access Denied</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #f8f9fa;
                            font-family: Arial, sans-serif;
                            text-align: center;
                        }
                        .container {
                            padding: 40px;
                            background: white;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #dc3545;
                            font-size: 2rem;
                            margin-bottom: 10px;
                        }
                        p {
                            font-size: 1.2rem;
                            color: #6c757d;
                        }
                        a {
                            display: inline-block;
                            margin-top: 15px;
                            padding: 10px 20px;
                            color: white;
                            background: #007bff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        a:hover {
                            background: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Access Denied 🚫</h1>
                        <p>You do not have permission to access this page.</p>
                        <a href="/">Go Back Home</a>
                    </div>
                </body>
                </html>`,
                { status: 401, headers: { "Content-Type": "text/html" } }
            );
        }
    }
    
    return NextResponse.next();
});

// Apply middleware to all routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
