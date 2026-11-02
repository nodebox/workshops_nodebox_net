#!/bin/sh
cd "$(dirname "$0")"
echo 'You can now go to http://localhost:8000/'
python -m SimpleHTTPServer
