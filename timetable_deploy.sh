#!/usr/bin/env bash

### <<< HARD-CODED
user=meteor
group='www-data'
folder=/var/www/jazyx/timetable/
mongo_flag=run_mongo
### HARD-CODED >>>

if [ -n "$1" ];
then
  if [ $1 == mongo_flag ];
  then
    mongo_flag=true
  fi;
fi;

echo "Change ownership of package.tar.gz to meteor"
chown $user:$group package.tar.gz

echo "Move package.tar.gz to ${folder} and cd there"
mkdir -p $folder
mv package.tar.gz $folder
cd $folder
echo -n "Now in "; pwd

if [[ -d bundle ]]; then
  echo "bundle/ exists: Renaming current bundle for archival purposes" 
  newname="bundle.$(date +'%Y%m%d-%H%M')"
  mv bundle $newname
  echo "bundle renamed as ${newname}"
  ls -al
fi

echo "Unzip package.tar.gz"
tar xzf package.tar.gz

echo "Check that directory now contains a bundle/ directory..."
ls -al

echo "... and that it belongs to $user:$group"
chown $user:$group -R bundle
ls -al

# echo "npm can't create the node_modules/ directory, so do it manually as we are in sudo mode"
# mkdir -p bundle/programs/server/node_modules

sudo -u meteor -H bash -l << HERE
echo -n "Execute code as user "; whoami
cd bundle/programs/server
echo -n "Install package at "; pwd;
npm install --production
HERE

echo "Return to sudo to delete package.tar.gz"
rm package.tar.gz
ls -al

if [ mongo_flag = true ];
then
  echo "Run mongo script before restarting the server"
  mongo --eval "load('mongo.js')"
 fi;

echo "Restart nginx"
nginx -t
service nginx restart

