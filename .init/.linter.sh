#!/bin/bash
cd /home/kavia/workspace/code-generation/breadcrumbs-demo-with-tailwind-css-and-react-2351-2360/breadcrumbs_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

