init_git_submodules() {
  cd "${CONTRACTS_ROOT_DIR}" &&
    git submodule update --init --recursive
}

build() {
  forge build
}

generate_const_typescript_abi_for() {
  local contract_name && contract_name="$1"
  local contract_file && contract_file="${contract_name}.sol"
  local dir && dir="${CONTRACTS_ROOT_DIR}out/${contract_file}/"

  cat <<EOF >"${dir}index.ts"
const contract = $(cat "${dir}${contract_name}.json") as const
export default contract.abi
EOF
}

generate_const_typescript_abi_for_all_contracts() {
  generate_const_typescript_abi_for "CommitmentStore" &&
    generate_const_typescript_abi_for "Prover"
}

main() {
  init_git_submodules &&
    build &&
    generate_const_typescript_abi_for_all_contracts
}

main
