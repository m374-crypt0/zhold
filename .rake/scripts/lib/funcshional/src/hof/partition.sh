#!/bin/env bash

set -o pipefail

# shellcheck source=../internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

partition_first() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_PARTITION_PREDICATE &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local top_size &&
    top_size=0
  local top
  local bottom
  local line

  while IFS= read -r line; do
    if [ -n "$line" ]; then
      if "$f" "$line" "${args_array[@]}"; then
        top_size=$((top_size + 1))

        top="$(append_string_to_stream "$top" "$line")"
      else
        bottom="$(append_string_to_stream "$bottom" "$line")"
      fi
    fi
  done

  if [ "$top_size" -gt 0 ]; then
    echo "$top_size"
    echo "$top"
    if [ -n "$bottom" ]; then
      echo "$bottom"
    fi
  fi
}

partition_last() {
  local f &&
    is_function_ "$1" ||
    return $FUNCSHIONAL_INVALID_PARTITION_PREDICATE &&
    f="$1"

  shift
  local args_array &&
    args_array=("$@")

  local top_size &&
    top_size=0
  local top
  local bottom
  local line

  while IFS= read -r line; do
    if [ -n "$line" ]; then
      if "$f" "${args_array[@]}" "$line"; then
        top_size=$((top_size + 1))

        top="$(append_string_to_stream "$top" "$line")"
      else
        bottom="$(append_string_to_stream "$bottom" "$line")"
      fi
    fi
  done

  if [ "$top_size" -gt 0 ]; then
    echo "$top_size"
    echo "$top"
    if [ -n "$bottom" ]; then
      echo "$bottom"
    fi
  fi
}
