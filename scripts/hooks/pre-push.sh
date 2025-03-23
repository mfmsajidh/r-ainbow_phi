#!/bin/bash
echo "🚀 Verifying build & tests before push..."
yarn build
yarn test --passWithNoTests
