const fs = require('fs');
const path = require('path');

const pathToSwarkRegexp = /\/.*\/swark\//ig;
let finalString = '';

function walkSync(dir, h = '#') {
    const files = fs.readdirSync(dir, { withFileTypes: true, encoding: 'utf-8' });
    for (const file of files) {
        const isFilesIncluded = Boolean(h !== '#');
        const isDirectory = file.isDirectory();
        const isHidden = file.name[0] === '.';
        const isImagesDirectory = file.name === 'img';
        if (isImagesDirectory) {
            continue;
        }
        if (isDirectory && !isHidden) {
            const headerMarkdown = h + '#';
            const headerText = capitalizeFirstLetter(file.name);
            const header = `${headerMarkdown} ${headerText}`;
            addToFinalString(header);
            walkSync(path.join(dir, file.name), h + '#');
            continue;
        }
        if (isFilesIncluded) {
            const filePath = path.join(dir, file.name);
            const content = fs.readFileSync(filePath).toString();
            const regex = /title:.*/g;
            const found = content.match(regex);
            if (found && found[0]) {
                const title = found[0].replace('title: ', '');
                const path = encodeURI(filePath);
                addToFinalString(`- [${title}](${path})`, '');
            }
        }
    }
}

function addToFinalString(text, startsWith='\n') {
    finalString = `${finalString}${startsWith}${text}\n`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

walkSync(__dirname)
console.log(finalString.replaceAll(pathToSwarkRegexp, '/'))