SCRIPT_DIR="./ops"
CONDA_PREFIX="./.conda"

echo "PACKAGING THE THEME..."
conda run --live-stream --prefix "$CONDA_PREFIX" vsce package
echo

echo "PUBLISHING THE THEME..."
conda run --live-stream --prefix "$CONDA_PREFIX" vsce publish
echo

echo "ARCHIVING THE THEME..."
mv -u -v *.vsix ./archives
echo

