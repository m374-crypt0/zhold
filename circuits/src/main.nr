use dep::poseidon::poseidon2;

type Poseidon2 = poseidon2::Poseidon2;

fn main(
    customer_id: Field,
    customer_salt: Field,
    policy_id: pub Field,
    policy_scope: pub Field,
    validity_time_range: pub Field,
    customer_address: pub Field,
    commitment: pub Field,
) {
    let computed_commitment: Field = Poseidon2::hash(
        [
            customer_id,
            customer_salt,
            policy_id,
            policy_scope,
            validity_time_range,
            customer_address,
        ],
        6,
    );

    assert_eq(commitment, computed_commitment, "Invalid commitment value");
}

#[test(should_fail_with = "Invalid commitment value")]
fn test_main_fails_with_unmatched_commitment_and_input_hashes() {
    let customer_id: Field = 0;
    let customer_salt: Field = 0;
    let policy_id: Field = 0;
    let policy_scope: Field = 0;
    let validity_time_range: Field = 0;
    let customer_address: Field = 0;
    let commitment: Field = 0;

    main(
        customer_id,
        customer_salt,
        policy_id,
        policy_scope,
        validity_time_range,
        customer_address,
        commitment,
    );
}

#[test]
fn test_main_succeeds_with_matching_commitment_and_input_hashes() {
    let customer_id = 42;
    let customer_salt = 99;
    let policy_id = 0;
    let policy_scope = 0;
    let validity_time_range = 1770297431;
    let customer_address = 0x2E59097CF55739E9Cd051287c4994310806D1bA9;
    let commitment = Poseidon2::hash(
        [
            customer_id,
            customer_salt,
            policy_id,
            policy_scope,
            validity_time_range,
            customer_address,
        ],
        6,
    );

    main(
        customer_id,
        customer_salt,
        policy_id,
        policy_scope,
        validity_time_range,
        customer_address,
        commitment,
    );
}
