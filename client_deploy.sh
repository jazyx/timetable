#!/usr/bin/env bash

echo "Executing $0 in $(pwd)"

### <<< HARD-CODED
sudoer=blackslate
server='94.76.206.212'

server_script='timetable_deploy.sh'

holding="../ArchivedMeteorPackages"
project="Timetable"
directory=$holding/$project
### HARD-CODED >>>

remote=$sudoer@$server
filename=$(date +'%Y%m%d-%H%M'.tar.gz)
temp="$directory/package.tar.gz"
final="$directory/$filename"

echo "Ensure that project directory exists"
mkdir -p $directory

echo "Build a server-only package in the holding directory"
meteor build --server-only ${holding}

echo "Rename it and move it to its project directory"
mv ${holding}/*.tar.gz ${temp}

echo "Upload package.tar.gz to ${remote}:~" 
scp ${temp} $remote:~

echo "Rename package.tar.gz in place for archiving purposes"
mv ${temp} ${final}

echo "Upload ${server_script} to ${remote}:~"
scp ${server_script} $remote:~

echo "Log in to ${remote}"
ssh $remote