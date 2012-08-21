all: install

install:
	./check_nw_install
	./check_node_dep

clean:
	rm -rf {node_modules/*,tmp/*,*.log}
