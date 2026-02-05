use std::field::bn254::assert_gt;

fn main(
    customer_id: Field,
    customer_salt: Field,
    policy_id: pub Field,
    policy_scope_hash: pub Field,
    validity_time_range: pub Field,
    customer_address: pub Field,
    commitment: pub Field,
) {
    assert_gt(customer_id, 0);
}

#[test(should_fail)]
fn test_main_fails_with_invalid_input_values() {
    let customer_id: Field = 0;
    let customer_salt: Field = 0;
    let policy_id: Field = 0;
    let policy_scope_hash: Field = 0;
    let validity_time_range: Field = 0;
    let customer_address: Field = 0;
    let commitment: Field = 0;

    main(
        customer_id,
        customer_salt,
        policy_id,
        policy_scope_hash,
        validity_time_range,
        customer_address,
        commitment,
    );
}
