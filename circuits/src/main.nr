type Poseidon2 = ::poseidon::poseidon2::Poseidon2;

fn main(
    customer_id: Field,
    customer_secret: Field,
    authorized_sender: Field,
    policy_id: pub Field,
    policy_scope_id: pub Field,
    policy_scope_parameter_valid_until: pub Field,
    sender: pub Field,
    current_timestamp: pub Field,
    commitment: pub Field,
) {
    assert_eq(sender, authorized_sender, "Unauthorized sender");
    assert(
        current_timestamp as u32 <= policy_scope_parameter_valid_until as u32,
        "Time limit exceeded",
    );

    let computed_commitment: Field = Poseidon2::hash(
        [
            customer_id,
            customer_secret,
            authorized_sender,
            policy_id,
            policy_scope_id,
            policy_scope_parameter_valid_until,
        ],
        6,
    );

    assert_eq(commitment, computed_commitment, "Invalid commitment value");
}

#[test(should_fail_with = "Unauthorized sender")]
fn test_main_fails_with_unmatched_sender_addresses() {
    let customer_id: Field = 0;
    let customer_secret: Field = 0;
    let policy_id: Field = 0;
    let policy_scope_id: Field = 0;
    let policy_scope_parameter_valid_until: Field = 0;
    let authorized_sender: Field = 0;
    let sender: Field = 1;
    let current_timestamp: Field = 0;
    let commitment: Field = 0;

    main(
        customer_id,
        customer_secret,
        authorized_sender,
        policy_id,
        policy_scope_id,
        policy_scope_parameter_valid_until,
        sender,
        current_timestamp,
        commitment,
    );
}

#[test(should_fail_with = "Time limit exceeded")]
fn test_main_fails_with_current_timestamp_exceeding_valid_until() {
    let customer_id: Field = 0;
    let customer_secret: Field = 0;
    let policy_id: Field = 0;
    let policy_scope_id: Field = 0;
    let policy_scope_parameter_valid_until: Field = 1;
    let authorized_sender: Field = 0;
    let sender: Field = 0;
    let current_timestamp: Field = 2;
    let commitment: Field = 0;

    main(
        customer_id,
        customer_secret,
        authorized_sender,
        policy_id,
        policy_scope_id,
        policy_scope_parameter_valid_until,
        sender,
        current_timestamp,
        commitment,
    );
}

#[test(should_fail_with = "Invalid commitment value")]
fn test_main_fails_with_unmatched_commitment_and_input_hashes() {
    let customer_id: Field = 0;
    let customer_secret: Field = 0;
    let policy_id: Field = 0;
    let policy_scope_id: Field = 0;
    let policy_scope_parameter_valid_until: Field = 0;
    let authorized_sender: Field = 0;
    let sender: Field = 0;
    let current_timestamp: Field = 0;
    let commitment: Field = 0;

    main(
        customer_id,
        customer_secret,
        authorized_sender,
        policy_id,
        policy_scope_id,
        policy_scope_parameter_valid_until,
        sender,
        current_timestamp,
        commitment,
    );
}

#[test]
fn test_main_succeeds_with_matching_commitment_and_input_hashes() {
    let customer_id = 42;
    let customer_secret = 99;
    let authorized_sender = 0x240aca6E8bfa428367728649Abf452053a9FFb55;
    let policy_id = 0;
    let policy_scope_id = 0;
    let policy_scope_parameter_valid_until = 1770297431;
    let sender = authorized_sender;
    let current_timestamp = policy_scope_parameter_valid_until;

    let commitment = Poseidon2::hash(
        [
            customer_id,
            customer_secret,
            authorized_sender,
            policy_id,
            policy_scope_id,
            policy_scope_parameter_valid_until,
        ],
        6,
    );

    main(
        customer_id,
        customer_secret,
        authorized_sender,
        policy_id,
        policy_scope_id,
        policy_scope_parameter_valid_until,
        sender,
        current_timestamp,
        commitment,
    );
}
