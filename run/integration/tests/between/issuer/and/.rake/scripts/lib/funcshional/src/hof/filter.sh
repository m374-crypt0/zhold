#!/bin/env bash

set -o pipefail

# shellcheck source=../internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

filter_first() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_FILTER_PREDICATE &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      if "$f" "$line" "${args_array[@]}"; then
        echo "$line"
      fi
    fi
  done
}

filter_last() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_FILTER_PREDICATE &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      if "$f" "${args_array[@]}" "$line"; then
        echo "$line"
      fi
    fi
  done
}
