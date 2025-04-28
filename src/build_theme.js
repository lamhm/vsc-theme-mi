const fs = require('fs')
const path = require("path")

const themeDir = path.join(__dirname, '../themes')
const sourceFile = path.join(__dirname, 'mi-dark.json')


buildThemeFile(sourceFile)
if (process.argv.length < 3 || !process.argv.includes('--no-watch')) {
    fs.watchFile(sourceFile, (curr, prev) => {
        buildThemeFile(sourceFile)
    })
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
