#!/bin/bash

# Post-Pull Hook Script
# Add this to your git pull workflow

# After git pull, always run:
# ./fix-after-pull.sh

# Or add as git hook:
# ln -s ../../post-pull-hook.sh .git/hooks/post-merge

cd /var/www/dreamshop
./fix-after-pull.sh
