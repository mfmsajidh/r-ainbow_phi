#!/bin/bash
echo "✅ Running Prettier, ESLint, Type check, and Unit Tests..."
yarn lint
yarn type-check
yarn test:ci
