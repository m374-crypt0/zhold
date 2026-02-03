cat <<EOF
Usage:

  make <TARGET> where <TARGET> is one of:

  - help: print this message
  - build: build all contracts and tests
  - clean: remove coontract compilation artifacts and deinit all forge
           dependency submodules
  - test: test all contracts and output a gas report
  - testv: test all contracts and output detailed report about failures
  - watch: continuously test all contracts. Run test suites for each file
    modification
  - watchv: continuously test all contracts. Run test suites for each file
    modification. Output detailed report on failures.
  - coverage: run all tests and report coverage information on screen
  - coverage_ci: output a lcov file containing coverage info. For CI purposes.
  - local_deploy: deploy contracts on a local running blockchain
  - sepolia_deploy: deploy contracts on sepolia testnet

  There are other target built for internal purposes, take a look if you're
  curious
EOF
