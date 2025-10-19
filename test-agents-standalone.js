#!/usr/bin/env node

/**
 * Standalone Lyzr Agent Test Script
 * Tests agents directly via API without Next.js dependencies
 */

const https = require('https');

// Configuration
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

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to make HTTPS requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test Content Analyzer Agent
async function testContentAnalyzer() {
  log(colors.blue, '\n🤖 Testing Content Analyzer Agent');
  log(colors.yellow, '=' .repeat(50));

  const testContent = 'Just shipped my first AI-powered app using @vercel and @openai. The developer experience is incredible - went from idea to production in under 24 hours. What\'s your go-to stack for rapid prototyping? #AI #WebDev #IndieHacker';

  const payload = {
    user_id: API_CONFIG.userId,
    agent_id: API_CONFIG.agents.analyzer,
    session_id: `${API_CONFIG.agents.analyzer}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    message: `Analyze this social media content for virality, engagement, and audience insights: "${testContent}"`
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

  try {
    log(colors.cyan, '🔍 Sending analysis request...');
    const response = await makeRequest(options, payload);

    if (response.statusCode === 200) {
      log(colors.green, '✅ API call successful!');
      log(colors.magenta, '📝 Raw Response:');
      console.log(JSON.stringify(response.data, null, 2));

      // Try to parse structured output
      try {
        const content = response.data.response || response.data.message || '';
        if (content.includes('{')) {
          const start = content.indexOf('{');
          const end = content.lastIndexOf('}') + 1;
          const jsonStr = content.substring(start, end);
          const parsed = JSON.parse(jsonStr);

          log(colors.green, '🎯 Successfully parsed structured output!');
          if (parsed.scores) {
            log(colors.magenta, `📊 Scores: Virality ${parsed.scores.virality}, Clarity ${parsed.scores.clarity}`);
          }
          if (parsed.targetGroup) {
            log(colors.magenta, `👥 Target: ${parsed.targetGroup.profession}`);
          }
        }
      } catch (parseError) {
        log(colors.yellow, '⚠️ Could not parse structured output, but API responded');
      }

      return true;
    } else {
      log(colors.red, `❌ API Error: ${response.statusCode}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ Request Failed: ${error.message}`);
    return false;
  }
}

// Test Content Ranker Agent
async function testContentRanker() {
  log(colors.blue, '\n🏆 Testing Content Ranker Agent');
  log(colors.yellow, '=' .repeat(50));

  const contents = [
    'Just shipped my first AI-powered app using @vercel and @openai!',
    'GitHub Copilot wrote 70% of my React component.',
    'From $0 to $10k MRR in 6 months.'
  ];

  const contentList = contents.map((content, index) => `${index + 1}. "${content}"`).join('\n');

  const payload = {
    user_id: API_CONFIG.userId,
    agent_id: API_CONFIG.agents.ranker,
    session_id: `${API_CONFIG.agents.ranker}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    message: `Rank and compare these content pieces by performance potential:\n${contentList}`
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

  try {
    log(colors.cyan, `🔍 Ranking ${contents.length} content pieces...`);
    const response = await makeRequest(options, payload);

    if (response.statusCode === 200) {
      log(colors.green, '✅ API call successful!');
      log(colors.magenta, '📝 Raw Response:');
      console.log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(colors.red, `❌ API Error: ${response.statusCode}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ Request Failed: ${error.message}`);
    return false;
  }
}

// Test Content Generator Agent
async function testContentGenerator() {
  log(colors.blue, '\n✍️ Testing Content Generator Agent');
  log(colors.yellow, '=' .repeat(50));

  const prompt = 'Generate a Twitter post about AI developments in software development';

  const payload = {
    user_id: API_CONFIG.userId,
    agent_id: API_CONFIG.agents.generator,
    session_id: `${API_CONFIG.agents.generator}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    message: `Generate engaging social media content based on this prompt: "${prompt}". Include current trends and make it optimized for maximum engagement.`
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

  try {
    log(colors.cyan, '🎯 Generating content...');
    const response = await makeRequest(options, payload);

    if (response.statusCode === 200) {
      log(colors.green, '✅ API call successful!');
      log(colors.magenta, '📝 Raw Response:');
      console.log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(colors.red, `❌ API Error: ${response.statusCode}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ Request Failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  log(colors.cyan, '🚀 Post2x Lyzr Agent API Tests');
  log(colors.yellow, '=' .repeat(60));
  log(colors.magenta, `API Endpoint: ${API_CONFIG.baseUrl}`);
  log(colors.magenta, `API Key: ${API_CONFIG.apiKey.substring(0, 20)}...`);
  log(colors.yellow, '=' .repeat(60));

  const startTime = Date.now();

  const results = {
    analyzer: await testContentAnalyzer(),
    ranker: await testContentRanker(),
    generator: await testContentGenerator()
  };

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  // Summary
  log(colors.yellow, '\n' + '=' .repeat(60));
  log(colors.cyan, '📊 TEST SUMMARY');
  log(colors.yellow, '=' .repeat(60));

  const passed = Object.values(results).filter(Boolean).length;
  const failed = Object.values(results).filter(v => !v).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([agent, success]) => {
    const status = success ? colors.green + '✅ PASSED' : colors.red + '❌ FAILED';
    log(colors.magenta, `${agent.toUpperCase()}: ${status}`);
  });

  log(colors.cyan, `\n🎯 Results: ${passed}/${total} tests passed`);
  log(colors.cyan, `⏱️ Duration: ${duration}s`);
  log(colors.magenta, `📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    log(colors.green, '\n🎉 All agents working perfectly!');
    log(colors.cyan, 'Your Post2x AI system is ready for production! 🚀');
  } else {
    log(colors.red, '\n⚠️ Some agents need attention.');
    log(colors.yellow, 'Check your Lyzr API configuration and agent setup.');
  }

  return results;
}

// CLI Interface
const args = process.argv.slice(2);

if (args.includes('--analyzer') || args.includes('-a')) {
  testContentAnalyzer();
} else if (args.includes('--ranker') || args.includes('-r')) {
  testContentRanker();
} else if (args.includes('--generator') || args.includes('-g')) {
  testContentGenerator();
} else if (args.includes('--help') || args.includes('-h')) {
  log(colors.cyan, 'Post2x Agent API Test Runner');
  log(colors.yellow, '\nUsage:');
  console.log('  node test-agents-standalone.js              # Run all tests');
  console.log('  node test-agents-standalone.js --analyzer   # Test content analyzer');
  console.log('  node test-agents-standalone.js --ranker     # Test content ranker');
  console.log('  node test-agents-standalone.js --generator  # Test content generator');
  console.log('  node test-agents-standalone.js --help       # Show this help');
  log(colors.yellow, '\nConfiguration:');
  console.log('  API Key: sk-default-0vXAp7xlIsAZ7Ocktmowe7DicKqNQGc0');
  console.log('  User ID: akash.c@goml.io');
  console.log('  Base URL: https://agent-prod.studio.lyzr.ai/v3/inference/chat/');
} else {
  runAllTests().catch(console.error);
}
