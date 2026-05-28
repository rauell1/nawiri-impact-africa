import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all route handler for all unmatched api endpoints under /api/*.
 * Logs the unmatched access attempt and returns a structured JSON 404 response.
 */
async function handleCatchAll(
  request: NextRequest,
  { params }: { params: { catchall: string[] } }
) {
  // Join the array path segments (e.g. ['v1', 'doesnotexist'] -> 'v1/doesnotexist')
  const path = params?.catchall ? params.catchall.join("/") : "";
  const timestamp = new Date().toISOString();
  
  console.warn(
    `[${timestamp}] [CATCH-ALL API] Unmatched ${request.method} request to '/api/${path}'`
  );

  return NextResponse.json(
    {
      error: "Not Found",
      message: `The API endpoint '/api/${path}' does not exist on this server.`,
      method: request.method,
      path: `/api/${path}`,
      timestamp,
    },
    { status: 404 }
  );
}

// Bind all standard HTTP verbs to the catch-all handler
export const GET = handleCatchAll;
export const POST = handleCatchAll;
export const PUT = handleCatchAll;
export const DELETE = handleCatchAll;
export const PATCH = handleCatchAll;
export const OPTIONS = handleCatchAll;
export const HEAD = handleCatchAll;
