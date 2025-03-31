#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to detect Express routes
function detectRoutes(dir) {
  const routes = [];
  const routeFiles = findRoutesFiles(dir);
  
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Look for express router definitions
    const routerRegex = /router\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = routerRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      
      // Get the controller function name if available
      const controllerMatch = content.substring(match.index).match(/,\s*([\w.]+)\s*\)/);
      const handler = controllerMatch ? controllerMatch[1] : 'unknown';
      
      routes.push({
        method,
        path,
        handler,
        source_file: file,
      });
    }
    
    // Look for app.[method] definitions
    const appRegex = /app\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g;
    while ((match = appRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      
      // Get the handler function name if available
      const controllerMatch = content.substring(match.index).match(/,\s*([a-zA-Z0-9_]+)\s*\)/);
      const handler = controllerMatch ? controllerMatch[1] : 'unknown';
      
      routes.push({
        method,
        path,
        handler,
        source_file: file,
      });
    }
  }
  
  return routes;
}

// Helper to find route files recursively
function findRoutesFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (file !== 'node_modules' && !file.startsWith('.')) {
        results = results.concat(findRoutesFiles(filePath));
      }
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      // Check if file might contain routes
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('router.') || content.includes('app.get') || 
          content.includes('app.post') || content.includes('app.put') || 
          content.includes('app.delete')) {
        results.push(filePath);
      }
    }
  }
  
  return results;
}

// For your specific directory structure
const rootDir = process.cwd(); // This is 'atlanto-island'
const serviceDir = path.join(rootDir, 'services', 'user-service');

// Check if the service directory exists
if (!fs.existsSync(serviceDir)) {
  console.error('User service directory not found at:', serviceDir);
  process.exit(1);
}

// Check if package.json exists in the service directory
if (!fs.existsSync(path.join(serviceDir, 'package.json'))) {
  console.error('package.json not found in user service directory');
  process.exit(1);
}

// Find the src directory in the service
const srcDir = path.join(serviceDir, 'src');
if (!fs.existsSync(srcDir)) {
  console.error('src directory not found in user service');
  process.exit(1);
}

// Detect routes
const apiRoutes = detectRoutes(srcDir);

// Add base path to the routes
const basePathRoutes = apiRoutes.map(route => {
  // If the detected route is from a file in a directory like 'routes/userRoutes.js'
  // Extract 'user' from 'userRoutes.js' to use as a base path
  const fileName = path.basename(route.source_file);
  let basePath = '';
  
  if (fileName.includes('Routes')) {
    basePath = fileName.replace('Routes.js', '').replace('routes.js', '');
    // Convert camelCase to kebab-case for URL path segments
    basePath = basePath.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    // If the route doesn't start with /, add it
    if (!route.path.startsWith('/')) {
      route.path = '/' + route.path;
    }
    
    // If this is a root path like '/', don't add the base path
    if (route.path === '/') {
      return {
        ...route,
        full_path: `/api/${basePath}`
      };
    }
    
    return {
      ...route,
      full_path: `/api/${basePath}${route.path}`
    };
  }
  
  return {
    ...route,
    full_path: route.path.startsWith('/') ? route.path : '/' + route.path
  };
});

// Add unique ID to each route
const apisWithId = basePathRoutes.map((route, index) => ({
  ...route,
  id: `api-${index + 1}`
}));

// Output the detected APIs
const outputPath = path.join(rootDir, 'detected-apis.json');
fs.writeFileSync(outputPath, JSON.stringify(apisWithId, null, 2));

console.log(`Detected ${apisWithId.length} API endpoints. Saved to ${outputPath}`);