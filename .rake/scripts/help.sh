#!/bin/env bash

print_help() {
  cat <<EOF
rake: redone with make - the utility your mono-repo deserves

  Here is the power of rake, you can specify a list of targets separated by
  spaces and execute them seamlessly.

usage:
  make <COMPOUND TARGETS> where <COMPOUND TARGETS> is a list of valid make
  targets built as following:

    make <SUB> <TARGET1> <TARGET2> ... <TARGETN> where <SUB> is a sub-directory
    located in the root directory of rake. A valid <SUB> must contain
    a valid Makefile having the targets you have specified in
    <COMPOUND TARGETS>

examples:
  Let's say you have a 'backend' sub and a 'frontend' sub in this root
  directory:

    make backend build test deploy

  It will:
  - build the backend
  - if successful test it
  - if successful deploy it

  Then you could:

    make frontend lint transpile deploy

  It will:
  - lint the frontend
  - if successful transpile it
  - if successful deploy it

  Everything at the root of rake, simple, obvious, idiot and boring.

EOF
}

forward_to_sub_if_applicable() {
  local ppid && local sub
  read -r ppid _ <<<"$(cat "${RAKE_ROOT_DIR}.rake/.registered_sub")"

  # shellcheck source=./forward_to_sub.sh
  [ $PPID -eq "$ppid" ] && . "${RAKE_ROOT_DIR}.rake/scripts/forward_to_sub.sh" help
}

main() {
  forward_to_sub_if_applicable ||
    print_help
}

main
