const fs = require('fs')
const path = require("path")

const themeDir = path.join(__dirname, '../themes')
const themeFiles = [
    'mi-dark.json',
    'mi-light.json'
];


buildTheme(themeFiles);


function buildTheme(themeFiles) {
    themeFiles.forEach(fileName => {
        const sourcePath = path.join(__dirname, fileName);
        buildThemeFile(sourcePath)
        if (process.argv.length < 3 || !process.argv.includes('--no-watch')) {
            fs.watch(sourcePath, (_eventType, _filename) => {
                buildThemeFile(sourcePath)
            });
        }
    });
}


function parseJson(jsonString) {
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
        const text = fs.readFileSync(sourceFile, 'utf-8')
        const parsedJson = parseJson(text)
        const { variables } = parsedJson

        delete parsedJson.variables
        let replaced = JSON.stringify(parsedJson, null, 4)

        Object.entries(variables).forEach(([key, value]) => {
            replaced = replaced.replaceAll(`"--${key}"`, `"${value}"`)
        })
        fs.writeFileSync(themeFile, replaced)
    } catch (e) {
        console.error(e)
    }
}
