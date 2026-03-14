generate_rwa_1_hold() {
  bun install --cwd "${CIRCUITS_ROOT_DIR}rwa_1/hold/solidity_verifier_generator"
  bun \
    "${CIRCUITS_ROOT_DIR}rwa_1/hold/solidity_verifier_generator/generator.ts" \
    "${CIRCUITS_ROOT_DIR}target/zk_assets_rwa_1_hold_v1_verifier.sol"
}

main() {
  generate_rwa_1_hold
}

main
