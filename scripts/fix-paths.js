const fs = require('fs-extra');
const path = require('path');

// Function to fix paths in HTML files
function fixPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix relative paths
    content = content.replace(/src="\.\.\/assets/g, 'src="/assets');
    content = content.replace(/href="\.\.\/css/g, 'href="/css');
    content = content.replace(/src="\.\.\/js/g, 'src="/js');
    
    // Fix navigation links
    content = content.replace(/href="\.\.\//g, 'href="/');
    
    fs.writeFileSync(filePath, content);
}

// Process all HTML files in dist directory
function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            console.log(`Processing: ${fullPath}`);
            fixPaths(fullPath);
        }
    });
}

// Start processing from dist directory
processDirectory('dist'); 