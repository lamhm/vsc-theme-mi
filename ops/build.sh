SCRIPT_DIR="./ops"
CONDA_PREFIX="./.conda"

echo "COMPILING THE THEME..."
conda run --live-stream --prefix "$CONDA_PREFIX" node src/build_theme.js --no-watch
echo

echo "PACKAGING THE THEME..."
conda run --live-stream --prefix "$CONDA_PREFIX" vsce package
echo

echo "PUBLISHING THE THEME..."
conda run --live-stream --prefix "$CONDA_PREFIX" vsce publish
echo

echo "ARCHIVING THE THEME..."
mv -u -v *.vsix ./archives
echo

