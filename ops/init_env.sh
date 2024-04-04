#!/bin/bash

SCRIPT_DIR="./ops"
CONDA_PREFIX="./.conda"

source "$SCRIPT_DIR/conda_helpers.sh"


if ! command -v conda &> /dev/null
then
    echo
    echo "ERROR: 'conda' command could not be found."
    echo
    exit
fi

echo

echo "INITIALISING THE CONDA ENVIRONMENT..."
echo
conda_env_init "$CONDA_PREFIX" "$SCRIPT_DIR" "$1"

# echo "INSTALLING PRE-COMMIT HOOKS FOR GIT..."
# conda run --live-stream --prefix "$CONDA_PREFIX" pre-commit install -t pre-commit -t commit-msg
# echo

# echo "INITIALISING THE PYTHON ENVIRONMENT..."
# conda run --live-stream --prefix "$CONDA_PREFIX" poetry install
# echo

echo "INSTALLING CLI TOOLS FOR MANAGING VS CODE EXTENSIONS..."
conda run --live-stream --prefix "$CONDA_PREFIX" npm install -g @vscode/vsce
conda run --live-stream --prefix "$CONDA_PREFIX" npm install -g yo generator-code
echo
