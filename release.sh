#!/bin/bash

FILE=RELEASE_NOTES
TMP_FILE=${FILE}.tmp
NAME=$(cat package.json | grep name | sed -e "s/.*name.*\"\(.*\)\",/\1/")
VERSION=$(cat package.json | grep version | sed -e "s/.*version.*\"\(.*\)\",/\1/")
TAG=v$VERSION

echo "$TAG" > ${TMP_FILE}
git describe --abbrev=0 2> /dev/null 1> /dev/null \
  && git log --pretty="%x09* [%h] %s." $(git describe --abbrev=0)..HEAD >> ${TMP_FILE} \
  || git log --pretty="%x09* [%h] %s." >> ${TMP_FILE}

echo "" >> ${TMP_FILE}

if [ -e $FILE ]; then
  cat ${FILE} >> ${TMP_FILE}
fi

mv ${TMP_FILE} $FILE

git add $FILE
git commit -a -m "[release-script] Updated release notes for version ${VERSION}"
npm version patch -m "[auto-release] version %s"
