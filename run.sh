#!/bin/bash
WDIR=$1
forever start -w --watchDirectory $WDIR -l runjs.log -a $WDIR/server/run.js

