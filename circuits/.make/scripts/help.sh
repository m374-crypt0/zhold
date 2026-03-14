cat <<EOF
Usage:

  make <TARGET> where <TARGET> is one of:

  - help: prints this message
  - clean: removes compiled artifacts from target directory
  - compile: compiles all circuits in the workspace
  - generate_solidity_verifiers: generate a smart contract verifier for each
    circuit in the workspace
  - test: tests all circuits in the workspace
  - watch: tests continuously all circuits for each file change in the
    workspace
EOF
