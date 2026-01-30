#!/bin/env bash

set -o pipefail

# shellcheck source=../hof/transform.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/transform.sh

take() {
  [ -z "$1" ] &&
    return $FUNCSHIONAL_MISSING_LIST_INDEX

  local n &&
    is_positive_integer_ "$1" ||
    return $FUNCSHIONAL_INVALID_LIST_INDEX &&
    n="$1"

  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      if [ "$n" -gt 0 ]; then
        echo "$line"
        n=$((n - 1))
      fi
    fi
  done
}

skip() {
  [ -z "$1" ] &&
    return $FUNCSHIONAL_MISSING_LIST_INDEX

  local n &&
    is_positive_integer_ "$1" ||
    return $FUNCSHIONAL_INVALID_LIST_INDEX &&
    n="$1"

  while [ "$n" -gt 0 ]; do
    discard_
    n=$((n - 1))
  done

  sink
}

prepend() {
  echo "$@"

  sink
}

append() {
  sink

  echo "$@"
}

any() {
  local ret &&
    ret=$FUNCSHIONAL_ANY_ON_EMPTY_LIST

  local line &&
    while read -r line; do
      if [ -n "$line" ]; then
        ret=0
        echo "$line"
      fi
    done

  return $ret
}
