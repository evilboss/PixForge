#!/bin/bash
set -e  # Exit immediately if any command fails

# Ensure APP is set
if [ -z "$APP" ]; then
  echo "❌ ERROR: APP variable is not set!"
  exit 1
fi

# Print debug info
echo "🚀 Starting application: yarn start $APP"

# Execute the command correctly
exec yarn start "$APP"
