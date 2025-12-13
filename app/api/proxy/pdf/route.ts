
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    let timeoutId: NodeJS.Timeout | undefined;

    try {
        console.log(`Proxying PDF: ${url}`);

        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`Failed to fetch PDF from ${url}: ${response.status} ${response.statusText}`);
            return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
        }

        // Stream the response instead of buffering it
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'inline; filename="brochure.pdf"');
        headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

        // Pass detailed errors if upstream fails mid-stream? Hard, but this is better.
        return new NextResponse(response.body, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error('Error proxying PDF:', error);
        clearTimeout(timeoutId); // Ensure timeout is cleared on error
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
