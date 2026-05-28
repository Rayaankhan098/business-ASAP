export const runtime = 'nodejs';

const ACTOR_ID = 'apify~google-search-scraper';
const APIFY_TOKEN = process.env.APIFY_TOKEN;

export async function POST(request) {
  if (!APIFY_TOKEN || APIFY_TOKEN === 'your-apify-token-here') {
    return Response.json({
      ok: false,
      reason: 'TOKEN_NOT_SET',
      message: 'APIFY_TOKEN is missing or still placeholder in .env.local',
    }, { status: 400 });
  }

  const { idea, name } = await request.json();

  if (!idea || idea === '—') {
    return Response.json({ ok: false, message: 'No idea text to search.' }, { status: 400 });
  }

  // Build a focused query: startup idea + competitors/market
  const query = `"${name}" startup OR "${idea.slice(0, 120)}" competitors market 2024 2025`;

  try {
    // Start the Apify actor run
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60&memory=256`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: query,
          maxPagesPerQuery: 1,
          resultsPerPage: 8,
          mobileResults: false,
          languageCode: 'en',
          countryCode: 'us',
        }),
      }
    );

    if (!runRes.ok) {
      const errText = await runRes.text();
      return Response.json({
        ok: false,
        message: `Apify error ${runRes.status}: ${errText.slice(0, 200)}`,
      }, { status: 502 });
    }

    const items = await runRes.json();

    // items is an array of search result pages, each with an organicResults array
    const results = (items?.[0]?.organicResults || []).map((r) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    }));

    return Response.json({ ok: true, query, results });
  } catch (err) {
    return Response.json({
      ok: false,
      message: err.message,
    }, { status: 500 });
  }
}
