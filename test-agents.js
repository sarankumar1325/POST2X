#!/usr/bin/env node

/**
 * Simple Lyzr Agent Test Script
 * Tests agents using direct API calls
 */

const https = require('https');

// Configuration - Update these with your actual values
const API_CONFIG = {
  baseUrl: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
  apiKey: 'sk-default-0vXAp7xlIsAZ7Ocktmowe7DicKqNQGc0',
  userId: 'akash.c@goml.io',
  agents: {
    analyzer: '68bc42b8cc9c7b45bbcc0fcb',
    ranker: '68bc43a723454f14b14b1c3b',
    generator: '68bc43a723454f14b14b1c3b'
  }
};

function makeAPIRequest(agentId, message) {
  return new Promise((resolve, reject) => {
    const sessionId = `${agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      user_id: API_CONFIG.userId,
      agent_id: agentId,
      session_id: sessionId,
      message: message
    };

    const options = {
      hostname: 'agent-prod.studio.lyzr.ai',
      path: '/v3/inference/chat/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.apiKey,
        'Content-Length': JSON.stringify(payload).length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function testContentAnalyzer() {
  console.log('\n🤖 Testing Content Analyzer Agent...');

  const testContent = 'Just shipped my first AI-powered app using @vercel and @openai. The developer experience is incredible - went from idea to production in under 24 hours.';

  try {
    const response = await makeAPIRequest(
      API_CONFIG.agents.analyzer,
      `Analyze this social media content for virality, engagement, and audience insights: "${testContent}"`
    );

    if (response.statusCode === 200) {
      console.log('✅ SUCCESS - Content Analyzer working');
      console.log('📊 Response received');
      return true;
    } else {
      console.log(`❌ FAILED - Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function testContentRanker() {
  console.log('\n🏆 Testing Content Ranker Agent...');

  const contents = [
    'Just shipped my first AI-powered app!',
    'GitHub Copilot wrote 70% of my React component.',
    'From $0 to $10k MRR in 6 months.'
  ];

  try {
    const contentList = contents.map((content, index) => `${index + 1}. "${content}"`).join('\n');
    const response = await makeAPIRequest(
      API_CONFIG.agents.ranker,
      `Rank and compare these content pieces by performance potential:\n${contentList}`
    );

    if (response.statusCode === 200) {
      console.log('✅ SUCCESS - Content Ranker working');
      console.log('📊 Response received');
      return true;
    } else {
      console.log(`❌ FAILED - Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function testContentGenerator() {
  console.log('\n✍️ Testing Content Generator Agent...');

  try {
    const response = await makeAPIRequest(
      API_CONFIG.agents.generator,
      'Generate a Twitter post about AI developments in software development'
    );

    if (response.statusCode === 200) {
      console.log('✅ SUCCESS - Content Generator working');
      console.log('📊 Response received');
      return true;
    } else {
      console.log(`❌ FAILED - Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Post2x Lyzr Agent Tests');
  console.log('=' .repeat(50));

  const results = await Promise.allSettled([
    testContentAnalyzer(),
    testContentRanker(),
    testContentGenerator()
  ]);

  const passed = results.filter(r => r.status === 'fulfilled' && r.value).length;
  const failed = results.filter(r => r.status === 'rejected' || !r.value).length;

  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESULTS SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (passed > 0) {
    console.log('\n🎉 Agents are responding! Check the Lyzr dashboard for detailed results.');
  } else {
    console.log('\n⚠️ All tests failed. Check your API configuration.');
  }
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--analyzer')) {
  testContentAnalyzer();
} else if (args.includes('--ranker')) {
  testContentRanker();
} else if (args.includes('--generator')) {
  testContentGenerator();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log('Post2x Agent Test Runner');
  console.log('Usage:');
  console.log('  node test-agents.js              # Run all tests');
  console.log('  node test-agents.js --analyzer   # Test analyzer');
  console.log('  node test-agents.js --ranker     # Test ranker');
  console.log('  node test-agents.js --generator  # Test generator');
} else {
  runTests();
}
