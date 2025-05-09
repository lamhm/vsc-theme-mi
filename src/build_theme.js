const fs = require('fs')
const path = require("path")

const themeDir = path.join(__dirname, '../themes')

const commonFile = 'common.json'
const commonFilePath = path.join(__dirname, commonFile)

const themeFiles = [
    'mi-dark.json',
    'mi-light.json'
];


buildTheme();
if (process.argv.length < 3 || !process.argv.includes('--no-watch')) {
    autoRebuild();
}


function autoRebuild() {
    let fileChanged = false
    const watchedFiles = [...themeFiles, commonFile]

    watchedFiles.forEach(
        fileName => {
            const filePath = path.join(__dirname, fileName);
            fs.watch(filePath, (_eventType, _fileName) => {
                fileChanged = true
            });
        }
    );

    setInterval(
        () => {
            if (fileChanged) {
                fileChanged = false
                buildTheme();
            }
        },
        500
    );
}


function buildTheme() {
    themeFiles.forEach(fileName => {
        const sourcePath = path.join(__dirname, fileName);
        buildThemeFile(sourcePath)
    });

}


function parseJsonFile(filePath) {
    const jsonString = fs.readFileSync(filePath, 'utf-8')

    // Remove comments
    var cleanedJsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');

    // Remove trailing commas
    cleanedJsonString = cleanedJsonString.replace(/,\s*([\]}])/g, '$1');

    return JSON.parse(cleanedJsonString);
}


function buildThemeFile(sourceFile) {
    const themeFile = path.join(themeDir, path.basename(sourceFile))

    console.log(`Rebuilding theme from '${sourceFile}'...`);
    try {
        const commonJson = parseJsonFile(commonFilePath)
        const sourceJson = parseJsonFile(sourceFile)
        const mergedJson = mergeJsonObjects(commonJson, sourceJson)
        const { variables } = mergedJson

        delete mergedJson.variables
        let replaced = JSON.stringify(mergedJson, null, 4)

        Object.entries(variables).forEach(([key, value]) => {
            replaced = replaced.replaceAll(`"--${key}"`, `"${value}"`)
        })
        fs.writeFileSync(themeFile, replaced)
    } catch (e) {
        console.error(e)
    }
}


function mergeJsonObjects(overridden, precedence) {
    const merged = { ...overridden };

    Object.keys(precedence).forEach(key => {
        if (precedence[key] && typeof precedence[key] === 'object' && !Array.isArray(precedence[key])) {
            // If both precedence and overriden have the same key and the value is an object, merge recursively
            merged[key] = mergeJsonObjects(overridden[key] || {}, precedence[key]);
        } else {
            merged[key] = precedence[key];
        }
    });

    return merged;
}
