#!/bin/bash

SCRIPT=`realpath -s $0`
SCRIPTPATH=`dirname $SCRIPT`
GUNICORNPATH=`which gunicorn`
cd "${SCRIPTPATH}"
${GUNICORNPATH} -b 127.0.0.1:58081 -w 1 --reload --preload --threads 2 app:app
