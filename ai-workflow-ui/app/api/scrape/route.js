import { NextResponse } from 'next/server';

// This function runs entirely on the backend server, completely bypassing browser CORS limits!
export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Server-side fetch (100% clean, no proxy needed)
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch webpage: ${response.statusText}`);
    }

    const rawHtml = await response.text();

    // 1. Strip out heavy structural script/style elements
    let cleanTextSample = rawHtml
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ');

    // --- HTML ENTITY DECODER NODES ---
    // This instantly translates standard web code tags back into clean human text symbols
    cleanTextSample = cleanTextSample
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&nbsp;', ' ');

    // 2. Format whitespaces and slice a clean sample preview
    cleanTextSample = cleanTextSample
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000); 

    return NextResponse.json({ textContent: cleanTextSample });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
