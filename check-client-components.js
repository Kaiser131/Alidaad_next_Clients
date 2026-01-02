#!/usr/bin/env node

/**
 * Next.js Migration Helper
 * Scans for files that likely need 'use client' directive
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const clientIndicators = [
  /useState/,
  /useEffect/,
  /useContext/,
  /useReducer/,
  /useCallback/,
  /useMemo/,
  /useRef/,
  /onClick/,
  /onChange/,
  /onSubmit/,
  /addEventListener/,
  /window\./,
  /document\./,
  /localStorage/,
  /sessionStorage/,
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has 'use client'
    if (content.includes("'use client'") || content.includes('"use client"')) {
      return null;
    }
    
    // Check for client indicators
    const indicators = [];
    for (const pattern of clientIndicators) {
      if (pattern.test(content)) {
        indicators.push(pattern.source);
      }
    }
    
    if (indicators.length > 0) {
      return {
        file: filePath.replace(srcDir, 'src'),
        indicators: indicators.slice(0, 3), // First 3 indicators
      };
    }
  } catch (err) {
    // Ignore errors
  }
  return null;
}

function scanDirectory(dir, results = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (item !== 'node_modules' && item !== '.next') {
        scanDirectory(fullPath, results);
      }
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(item)) {
      const result = scanFile(fullPath);
      if (result) {
        results.push(result);
      }
    }
  }
  
  return results;
}

console.log('🔍 Scanning for files that may need "use client" directive...\n');

const results = scanDirectory(srcDir);

if (results.length === 0) {
  console.log('✅ No files need updating!');
} else {
  console.log(`Found ${results.length} files that may need 'use client':\n`);
  
  for (const result of results) {
    console.log(`📄 ${result.file}`);
    console.log(`   Indicators: ${result.indicators.join(', ')}`);
    console.log('');
  }
  
  console.log('\n💡 Add "use client"; at the top of these files if they use client-side features.');
}
