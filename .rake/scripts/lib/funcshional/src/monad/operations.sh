#!/bin/env bash

set -o pipefail

# shellcheck source=../hof/transform.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/transform.sh

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

lift() {
  [ $# -eq 0 ] &&
    return $FUNCSHIONAL_MONAD_LIFT_MISSING_OPERATION

  local output &&
    local ret &&
    output=$("$@")

  ret=$?

  echo "local monad_ret && monad_ret=$ret"

  echo "$output"
}

unlift() {
  local monad_ret_decl &&
    read -t 1 -r monad_ret_decl ||
    return $FUNCSHIONAL_MONAD_INVALID_UNLIFT_CALL

  # NOTE: monad_ret variable is evaluated here, unlifting process
  # shellcheck disable=SC2154
  eval "$monad_ret_decl" &&
    is_positive_integer_ "$monad_ret" ||
    return $FUNCSHIONAL_MONAD_INVALID_UNLIFT_CALL

  sink

  return "$monad_ret"
}

and_then() {
  local monad_ret_decl &&
    read -t 1 -r monad_ret_decl ||
    return $FUNCSHIONAL_MONAD_INVALID_AND_THEN_CALL

  [ $# -eq 0 ] &&
    return $FUNCSHIONAL_MONAD_AND_THEN_MISSING_OPERATION

  # NOTE: monad_ret variable is evaluated here, unlifting process
  eval "$monad_ret_decl"

  if [ "$monad_ret" -ne 0 ]; then
    echo "local monad_ret && monad_ret=$monad_ret"

    sink

    return "$monad_ret"
  fi

  local output &&
    local ret &&
    output=$("$@")
  ret=$?

  echo "local monad_ret && monad_ret=$ret"

  sink

  echo "$output"

  return $ret
}

or_else() {
  local monad_ret_decl &&
    read -t 1 -r monad_ret_decl ||
    return $FUNCSHIONAL_MONAD_INVALID_OR_ELSE_CALL

  [ $# -eq 0 ] &&
    return $FUNCSHIONAL_MONAD_OR_ELSE_MISSING_OPERATION

  # NOTE: monad_ret variable is evaluated here, unlifting process
  eval "$monad_ret_decl"

  if [ "$monad_ret" -eq 0 ]; then
    echo "local monad_ret && monad_ret=$monad_ret"

    sink

    return "$monad_ret"
  fi

  local output &&
    local ret &&
    output=$("$@")
  ret=$?

  echo "local monad_ret && monad_ret=$ret"

  sink

  echo "$output"

  return $ret
}
