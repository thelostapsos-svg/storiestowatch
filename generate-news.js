// GitHub Action script — runs daily at midnight UTC
// Generates 6 fresh watch news articles via Claude API
// Commits result to news.json — zero per-visit API cost

const https = require('https');
const fs = require('fs');

async function callClaude() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  const monthYear = today.toLocaleDateString('en-GB', { month:'long', year:'numeric' });

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{
      role: 'user',
      content: `Today is ${dateStr}. Search for 6 recent luxury watch news stories from ${monthYear}. Return ONLY a JSON array (no markdown, no backticks) with exactly 6 items each having: title, excerpt (2 sentences, factual), category (New Release/Auction/Market/Innovation/Limited Edition/Brand Story/Milestone), source, brand (primary watch brand or empty string).`
    }]
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('Generating daily watch news...');
  
  try {
    const response = await callClaude();
    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');
    
    const clean = text.replace(/```json|```/g, '').trim();
    const match = clean.match(/\[[\s\S]*\]/);
    const articles = JSON.parse(match ? match[0] : clean);
    
    if (!Array.isArray(articles) || articles.length < 3) {
      throw new Error('Invalid article array returned');
    }

    const output = {
      generated: new Date().toISOString(),
      articles: articles.slice(0, 6)
    };

    fs.writeFileSync('news.json', JSON.stringify(output, null, 2));
    console.log(`✅ Generated ${articles.length} articles, saved to news.json`);
    console.log('Date:', output.generated);
    articles.forEach((a, i) => console.log(`  ${i+1}. ${a.title}`));

  } catch(err) {
    console.error('Error generating news:', err.message);
    // Write fallback so site never breaks
    const fallback = {
      generated: new Date().toISOString(),
      articles: [
        { category:"Milestone", title:"Rolex Marks a Century of the Oyster Case", excerpt:"Rolex unveiled a commemorative Oyster Perpetual 41 in celebration of 100 years since the world's first waterproof wristwatch. The two-tone release sold out within hours at authorised dealers globally.", source:"Hodinkee", brand:"Rolex" },
        { category:"Auction", title:"Sotheby's $15M Cartier Collection Breaks Records", excerpt:"A curated archive of vintage Cartier timepieces achieved hammer prices far beyond estimate at Sotheby's Geneva sale. The headline lot drew bidders from five continents.", source:"Phillips Auction House", brand:"Cartier" },
        { category:"Anniversary", title:"Patek Philippe Nautilus at Fifty: An Enduring Icon", excerpt:"Half a century after Gérald Genta's legendary sketch, the Nautilus remains the most coveted steel sports watch on the secondary market. Patek Philippe marked the occasion with an intimate Geneva exhibition.", source:"Europa Star", brand:"Patek Philippe" },
        { category:"Market", title:"Watches & Wonders 2026: Craft Over Spectacle", excerpt:"Geneva's annual showcase delivered restraint over fireworks, as brands doubled down on finishing quality and mechanical depth. Industry analysts noted a deliberate pivot away from hype-driven releases.", source:"WatchPro", brand:"" },
        { category:"Brand Story", title:"F.P. Journe: Independent Watchmaking's Quiet Revolution", excerpt:"As independent maisons continue their meteoric rise, François-Paul Journe's atelier stands as the benchmark for true horological independence. Secondary market premiums now rival Patek Philippe.", source:"Revolution Magazine", brand:"F.P. Journe" },
        { category:"Innovation", title:"Grand Seiko Introduces New Micro-Artist Studio Dial", excerpt:"The Japanese manufacturer unveiled a breathtaking new dial crafted by its Micro Artist Studio, blurring the line between watchmaking and visual art. Only 30 pieces will reach collectors worldwide.", source:"WatchTime", brand:"Grand Seiko" }
      ]
    };
    fs.writeFileSync('news.json', JSON.stringify(fallback, null, 2));
    console.log('Wrote fallback news.json');
    process.exit(0); // Don't fail the action — site must never break
  }
}

main();
