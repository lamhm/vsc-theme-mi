const fs = require('fs')
const path = require("path")

const themeDir = path.join(__dirname, '../themes')
const commonFile = 'common.json'
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
        const sourceText = fs.readFileSync(sourceFile, 'utf-8')
        const sourceJson = parseJson(sourceText)
        const { variables } = sourceJson

        delete sourceJson.variables
        let replaced = JSON.stringify(sourceJson, null, 4)

        Object.entries(variables).forEach(([key, value]) => {
            replaced = replaced.replaceAll(`"--${key}"`, `"${value}"`)
        })
        fs.writeFileSync(themeFile, replaced)
    } catch (e) {
        console.error(e)
    }
}
