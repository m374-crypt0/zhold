#!/bin/env bash

# shellcheck source=.rake/scripts/error_codes.sh
. "${RAKE_ROOT_DIR}.rake/scripts/error_codes.sh"

get_ppid() {
  if [ -n "$1" ]; then
    eval "$1"
  else
    echo "$PPID"
  fi
}

is_sub_registered_for_ppid() {
  local ppid && ppid="$1"

  [ -f "${RAKE_ROOT_DIR}.rake/.registered_sub" ] &&
    local registered_sub_ppid &&
    read -r registered_sub_ppid _ <<<"$(cat "${RAKE_ROOT_DIR}.rake/.registered_sub")"

  [ -n "$registered_sub_ppid" ] &&
    [ "$ppid" = "$registered_sub_ppid" ]
}

register_sub() {
  local ppid && ppid="$1"
  local target && target="$2"

  echo "$ppid $target" >"${RAKE_ROOT_DIR}.rake/.registered_sub"
}

is_valid_sub() {
  local sub && sub="$1"

  [ -f "${RAKE_ROOT_DIR}${sub}/Makefile" ]
}

get_sub_target_if_exists() {
  local sub && sub="$1"

  if [ -d "${RAKE_ROOT_DIR}${sub}" ]; then
    echo "$sub"
  elif [ -d "${RAKE_ROOT_DIR}.rake/${sub}" ]; then
    echo ".rake/$sub"
  else
    echo "$sub"

    return 1
  fi

}

make_sub_target_if_sub_exists() {
  local target && target="$1"

  local sub &&
    read -r _ sub <<<"$(cat "${RAKE_ROOT_DIR}.rake/.registered_sub")"

  local valid_sub_path &&
    if ! valid_sub_path="$(get_sub_target_if_exists "$sub")"; then
      echo "The '$sub' sub does not exist"

      return $RAKE_SUB_DOES_NOT_EXIST
    fi

  if ! is_valid_sub "$valid_sub_path"; then
    echo "The '$sub' sub is missing a 'Makefile'"

    return $RAKE_INVALID_SUB_DIRECTORY
  fi

  make -s -C "${RAKE_ROOT_DIR}${valid_sub_path}" "$target"
}

is_ignorable_target() {
  local target && target="$1"

  [ "$target" = Makefile ] ||
    [[ "$target" == */Makefile ]] && return
}

main() {
  local target && target="$1"

  is_ignorable_target "$target" && return

  local ppid_provider && ppid_provider="$2"

  local ppid && ppid="$(get_ppid "$ppid_provider")"

  if is_sub_registered_for_ppid "$ppid"; then
    make_sub_target_if_sub_exists "$target"
  else
    register_sub "$ppid" "$target"
  fi
}

main "$1" "$2"
