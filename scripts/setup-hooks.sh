#!/bin/bash
# Setup git hooks for automatic version generation

echo "Setting up git hooks..."

# Configure git to use our hooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks configured successfully!"
echo "The pre-commit hook will now automatically generate version info before each commit."
echo ""
echo "To manually generate version info, run: yarn version:generate"

