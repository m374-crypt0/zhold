cat <<EOF
Usage:

  make <TARGET> where <TARGET> is one of:

  - help: prints this message
  - clean: removes compiled artifacts from target directory
  - compile: compiles this circuit
  - generate_solidity_verifier: generate a Verifier.sol smart contract in the
  - test: tests this circuit
  - watch: tests continuously this circuit for each file change
EOF
