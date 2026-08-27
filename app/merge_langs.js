const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');
let content = fs.readFileSync(scriptPath, 'utf8');
const lines = content.split('\n');

// Find the pa dictionary closing by looking for "eventFestivalDesc" line followed by "    }" followed by "};"
let festivalLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('eventFestivalDesc:')) {
        // Check if next two lines are "    }" and "};"
        if (i + 2 < lines.length && lines[i+1].trim() === '}' && lines[i+2].trim() === '};') {
            festivalLine = i;
            break;
        }
    }
}

if (festivalLine === -1) {
    console.log('ERROR: Could not find eventFestivalDesc followed by } and };');
    process.exit(1);
}

console.log('Found eventFestivalDesc at line:', festivalLine + 1);

// The closing brace of pa should be at festivalLine + 1
const closingBraceLine = festivalLine + 1;
console.log('Closing brace at line:', closingBraceLine + 1, '->', lines[closingBraceLine].trim());

// The i18n closing should be at festivalLine + 2
const i18nCloseLine = festivalLine + 2;
console.log('i18n closing at line:', i18nCloseLine + 1, '->', lines[i18nCloseLine].trim());

// Read all language files
const langFiles = ['ur_dict.txt', 'gu_dict.txt', 'kn_dict.txt', 'as_dict.txt'];
const langData = [];
for (const f of langFiles) {
    const fpath = path.join(__dirname, f);
    if (fs.existsSync(fpath)) {
        langData.push(fs.readFileSync(fpath, 'utf8'));
        console.log('Loaded:', f);
    } else {
        console.log('Missing:', f);
    }
}

if (langData.length === 0) {
    console.log('No language files found');
    process.exit(1);
}

// Change "    }" to "    }," on the pa closing line
lines[closingBraceLine] = '    },';

// Insert language data before i18n closing
const insertText = langData.join('\n');
lines.splice(i18nCloseLine, 0, insertText);

content = lines.join('\n');
fs.writeFileSync(scriptPath, content, 'utf8');
console.log('Successfully inserted', langData.length, 'languages!');
