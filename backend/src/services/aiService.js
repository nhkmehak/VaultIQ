require('dotenv').config();

// =============================================================================
// GROQ AI API - Fast and Free
// Sign up at: https://console.groq.com/
// Add to .env: GROQ_API_KEY=your_key_here
// =============================================================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroqAPI(prompt) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq API Error:', error);
    return null;
  }
}

// Password strength checker
async function checkPasswordStrength(password) {
  const prompt = `Analyze this password strength and provide feedback in JSON format:
Password: "${password}"

Return ONLY a valid JSON object with these fields (no markdown, no code blocks):
{
  "strength": "weak/moderate/strong",
  "score": 0-100,
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  const result = await callGroqAPI(prompt);
  if (!result) {
    return { strength: 'moderate', score: 50, suggestions: ['Unable to analyze password'] };
  }

  try {
    const cleaned = result.replace(/```json|```|`/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Parse error:', error);
    return { strength: 'moderate', score: 50, suggestions: [] };
  }
}

// Generate product description
async function generateProductDescription(product) {
  const prompt = `Create a compelling 2-3 sentence description for this investment product:
Name: ${product.name}
Type: ${product.investment_type}
Tenure: ${product.tenure_months} months
Annual Yield: ${product.annual_yield}%
Risk Level: ${product.risk_level}

Return only the description text, no additional formatting or markdown.`;

  const result = await callGroqAPI(prompt);
  return result || `${product.name} is a ${product.risk_level} risk ${product.investment_type} investment with ${product.annual_yield}% annual yield over ${product.tenure_months} months.`;
}

// Product recommendations
async function recommendProducts(products, riskAppetite) {
  const prompt = `Given these investment products and a user with "${riskAppetite}" risk appetite, recommend the top 3 product IDs that best match their profile.

Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, risk_level: p.risk_level, annual_yield: p.annual_yield })))}

Return ONLY a JSON array of product IDs (no markdown, no code blocks):
["product_id_1", "product_id_2", "product_id_3"]`;

  const result = await callGroqAPI(prompt);
  if (!result) {
    return products.slice(0, 3).map(p => p.id);
  }

  try {
    const cleaned = result.replace(/```json|```|`/g, '').trim();
    const recommendations = JSON.parse(cleaned);
    return Array.isArray(recommendations) ? recommendations : products.slice(0, 3).map(p => p.id);
  } catch (error) {
    console.error('Parse error:', error);
    return products.slice(0, 3).map(p => p.id);
  }
}

// Portfolio insights
async function generatePortfolioInsights(investments, products) {
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  const riskCounts = { low: 0, moderate: 0, high: 0 };
  
  investments.forEach(inv => {
    const risk = inv.risk_level?.toLowerCase();
    if (risk in riskCounts) riskCounts[risk]++;
  });

  const total = investments.length || 1;
  const riskDistribution = {
    low: Math.round((riskCounts.low / total) * 100),
    moderate: Math.round((riskCounts.moderate / total) * 100),
    high: Math.round((riskCounts.high / total) * 100)
  };

  const prompt = `Analyze this investment portfolio and provide 3 specific, actionable insights:

Total Invested: $${totalInvested}
Number of Investments: ${investments.length}
Risk Distribution: ${riskDistribution.low}% Low, ${riskDistribution.moderate}% Moderate, ${riskDistribution.high}% High
Investment Types: ${[...new Set(investments.map(i => i.investment_type))].join(', ')}

Return ONLY a JSON object (no markdown, no code blocks):
{
  "totalValue": ${totalInvested},
  "riskDistribution": ${JSON.stringify(riskDistribution)},
  "insights": ["insight1", "insight2", "insight3"]
}`;

  const result = await callGroqAPI(prompt);
  if (!result) {
    return {
      totalValue: totalInvested,
      riskDistribution,
      insights: ['Your portfolio is being analyzed', 'Diversification recommended', 'Review your investment goals regularly']
    };
  }

  try {
    const cleaned = result.replace(/```json|```|`/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Parse error:', error);
    return {
      totalValue: totalInvested,
      riskDistribution,
      insights: ['Portfolio analysis complete', 'Consider rebalancing based on market conditions']
    };
  }
}

// Summarize errors
async function summarizeErrors(logs) {
  const prompt = `Summarize these error logs for a user in simple terms:

${JSON.stringify(logs.slice(0, 10))}

Provide a brief summary of common errors and suggestions. Return plain text, max 3 sentences. No markdown.`;

  const result = await callGroqAPI(prompt);
  return result || 'Multiple errors detected in the system. Please contact support for assistance.';
}

module.exports = {
  checkPasswordStrength,
  generateProductDescription,
  recommendProducts,
  generatePortfolioInsights,
  summarizeErrors
};