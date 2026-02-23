#!/bin/env bash

# shellcheck source=../../../.rake/scripts/error_codes.sh
. "${RAKE_ROOT_DIR}.rake/scripts/error_codes.sh"

. "${FUNCSHIONAL_ROOT_DIR}src/funcshional.sh"

list_subs() {
  find "$RAKE_ROOT_DIR" \
    -mindepth 1 \
    -maxdepth 1 \
    -not -name .rake \
    -not -name .git \
    -type d
}

only_valid_sub() {
  local sub && sub="$1"

  [ -f "${sub}/Makefile" ]
}

report_no_sub() {
  echo There is no sub >&2

  return $RAKE_NO_SUB
}

report_no_valid_sub_directories() (
  # shellcheck disable=SC2329
  format_invalid_sub_directory() {
    echo "- $(basename "$1")" >&2
  }

  echo There is no valid sub >&2
  echo "Following sub directories are missing a 'Makefile':" >&2

  echo "$1" |
    transform_first format_invalid_sub_directory

  return $RAKE_NO_VALID_SUB
)

let_sub_directories() {
  lift list_subs |
    and_then any |
    or_else report_no_sub |
    unlift
}

let_valid_sub_directories() (
  # shellcheck disable=SC2329
  format_valid_sub_directory() {
    basename "$1"
  }

  lift echo "$1" |
    and_then filter_first only_valid_sub |
    and_then any |
    and_then transform_first format_valid_sub_directory |
    or_else report_no_valid_sub_directories "$1" |
    unlift
)

append_alias() {
  local directory && directory="$1"

  echo "$directory (alias: ${directory:0:1})"
}

main() {
  local sub_directories &&
    sub_directories="$(let_sub_directories)" &&
    let_valid_sub_directories "$sub_directories"
}

main
