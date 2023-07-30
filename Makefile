install:
	npm install typescript --save-dev
	sudo npm install -g aptos
compile:
	tsc -esModuleInterop Code/index.ts
run:
	node Code/index.js