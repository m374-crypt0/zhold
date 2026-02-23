is_function_() {
  local f="$1"
  local f_type &&
    f_type="$(type -t "$f")"

  if [ "$f_type" != 'function' ]; then
    return 1
  fi
}

discard_() {
  local line
  while read -r line; do
    if [ -n "$line" ]; then
      break
    fi
  done
}

id_() {
  echo "$@"
}

is_positive_integer_() {
  local n &&
    n="$1"

  # NOTE: if n is 0, (( n + 0 )) fails...no comments
  [ "$n" -eq 0 ] &&
    return 0

  if ! ((n + 0)); then
    return 1
  fi

  if [ "$n" -lt 0 ]; then
    return 1
  fi
}
