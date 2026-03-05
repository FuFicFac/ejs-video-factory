import * as fs from 'fs';
import * as path from 'path';
import { extractSpecificScene } from '../parser/figma-node-parser.js';

console.log('Running Figma Parser Unit Test...\n');

try {
    // 1. Load the mocked JSON
    const mockPath = path.join(__dirname, 'mock-figma-api-response.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));

    // 2. Run the parser
    const parsedData = extractSpecificScene(mockData, 'HookScene');

    // 3. Output the result in a readable format
    console.log('✅ Parsed successfully! Resulting Prop Interface:');
    console.log(JSON.stringify(parsedData, null, 2));

    // 4. Example Assertion
    if (parsedData.elements.titleText.text !== 'Why AI Matters to Creators') {
        throw new Error('Title text mismatch');
    }
    if (parsedData.elements.titleText.fontColorCss !== 'rgba(255, 127.5, 51, 1)') {
        throw new Error('Font color math failed');
    }

} catch (error) {
    console.error('❌ Test Failed:\n', error);
    process.exit(1);
}
