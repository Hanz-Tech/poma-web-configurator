tsc
webpack --mode production
mkdir deploy
cp -r dist ./deploy
cp index.html ./deploy
cp styles.css ./deploy
