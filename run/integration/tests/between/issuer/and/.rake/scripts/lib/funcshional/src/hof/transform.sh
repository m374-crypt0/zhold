#!/bin/env bash

set -o pipefail

# shellcheck source=../internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

transform_first() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_TRANSFORM_FUNCTION &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      local r &&
        r="$("$f" "$line" "${args_array[@]}")" ||
        return $FUNCSHIONAL_TRANSFORM_FUNCTION_CALL_FAILED &&
        [ "$(wc -l <<<"$r")" -eq 1 ] ||
        return $FUNCSHIONAL_INVALID_TRANSFORM_FUNCTION_OUTPUT &&
        echo "$r"
    fi
  done
}

transform_last() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_TRANSFORM_FUNCTION &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      local r &&
        r="$("$f" "${args_array[@]}" "$line")" ||
        return $FUNCSHIONAL_TRANSFORM_FUNCTION_CALL_FAILED &&
        [ "$(wc -l <<<"$r")" -eq 1 ] ||
        return $FUNCSHIONAL_INVALID_TRANSFORM_FUNCTION_OUTPUT &&
        echo "$r"
    fi
  done
}

sink() {
  transform_first id_
}
