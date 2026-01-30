#!/bin/env bash

set -o pipefail

# shellcheck source=../internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

fold_first() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_FOLD_REDUCER &&
    f="$1"

  if [ $# -lt 2 ]; then
    return $FUNCSHIONAL_MISSING_FOLD_ACCUMULATOR
  fi

  local accumulated &&
    accumulated="$2"

  shift 2
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      accumulated="$("$f" "$line" "$accumulated" "${args_array[@]}")" ||
        return $FUNCSHIONAL_FOLD_REDUCER_INVOCATION_ERROR
    fi
  done

  echo "$accumulated"
}

fold_last() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_FOLD_REDUCER &&
    f="$1"

  if [ $# -lt 2 ]; then
    return $FUNCSHIONAL_MISSING_FOLD_ACCUMULATOR
  fi

  local accumulated &&
    accumulated="$2"

  shift 2
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      accumulated="$("$f" "${args_array[@]}" "$line" "$accumulated")" ||
        return $FUNCSHIONAL_FOLD_REDUCER_INVOCATION_ERROR
    fi
  done

  echo "$accumulated"
}
