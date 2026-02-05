#!/bin/env bash

function run_test() {
  cd "${CIRCUITS_ROOT_DIR}" &&
    nargo test
}

run_test

# TODO: replace with an infinite loop using inotifywatch to avoid multiple
# executions
inotifywait -mqr \
  --event modify \
  "${CIRCUITS_ROOT_DIR}src" |
  while read -r; do
    clear && run_test
  done
