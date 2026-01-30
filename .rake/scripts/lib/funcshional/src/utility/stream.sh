#!/bin/env bash

# shellcheck source=../error_codes.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/error_codes.sh

# shellcheck source=../internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

append_string_to_stream() {
  local stream &&
    stream="$1"

  local line &&
    line="$2"

  if [ -z "$stream" ]; then
    echo "$line"
  else
    echo "$stream"$'\n'"$line"
  fi
}

index() {
  local i && i=$1

  echo "$i"
}

generate() {
  [ $# -eq 0 ] &&
    return $FUNCSHIONAL_STREAMS_GENERATE_INVALID_CALL

  local size &&
    is_positive_integer_ "$1" ||
    return $FUNCSHIONAL_STREAMS_GENERATE_INVALID_SIZE &&
    size="$1"

  local generator &&
    is_function_ "$2" ||
    return $FUNCSHIONAL_STREAMS_GENERATE_INVALID_GENERATOR &&
    generator="$2"

  local i &&
    for ((i = 0; i < size; ++i)); do
      $generator $i
    done
}
