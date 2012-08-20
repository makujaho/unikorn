all: install

install:
	./check_nw_install
	npm install express@2.5.11
	npm install jade
	npm install less
	npm install ntwitter
	npm install twitter-bootstrap-node

clean:
	rm -rf {node_modules/*,tmp/*,*.log}
