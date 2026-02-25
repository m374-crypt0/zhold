init_git_submodules() {
  cd "${CONTRACTS_ROOT_DIR}" &&
    git submodule update --init --recursive
}

build() {
  forge build
}

generate_const_typescript_abi() {
  local dir && dir="${CONTRACTS_ROOT_DIR}out/CommitmentStore.sol/"

  cat <<EOF >"${dir}index.ts"
const contract = $(cat "${dir}CommitmentStore.json") as const
export default contract.abi
EOF
}

main() {
  init_git_submodules &&
    build &&
    generate_const_typescript_abi
}

main
