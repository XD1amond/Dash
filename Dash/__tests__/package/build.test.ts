import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Package build', () => {
  // Skip these tests in CI environment since they require building the package
  const runTests = process.env.CI !== 'true';
  
  // Helper function to check if a file exists
  const fileExists = (filePath: string): boolean => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      return false;
    }
  };

  // Run the build process before tests
  beforeAll(() => {
    if (runTests) {
      try {
        // Run the build process
        execSync('npm run build:package', { 
          cwd: path.resolve(__dirname, '../../'),
          stdio: 'inherit'
        });
      } catch (error) {
        console.error('Failed to build package:', error);
        throw error;
      }
    }
  });

  test('should generate dist directory', () => {
    if (!runTests) {
      console.log('Skipping build tests in CI environment');
      return;
    }
    
    const distPath = path.resolve(__dirname, '../../dist');
    expect(fileExists(distPath)).toBe(true);
  });

  test('should generate CommonJS output', () => {
    if (!runTests) return;
    
    const cjsPath = path.resolve(__dirname, '../../dist/index.js');
    expect(fileExists(cjsPath)).toBe(true);
  });

  test('should generate JavaScript output', () => {
    if (!runTests) return;
    
    const jsPath = path.resolve(__dirname, '../../dist/index.js');
    expect(fileExists(jsPath)).toBe(true);
  });

  test('should generate TypeScript declarations', () => {
    if (!runTests) return;
    
    const dtsPath = path.resolve(__dirname, '../../dist/index.d.ts');
    expect(fileExists(dtsPath)).toBe(true);
  });
});