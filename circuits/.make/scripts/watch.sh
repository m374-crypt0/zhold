#!/bin/env bash

function run_test() {
  make -C "${CIRCUITS_ROOT_DIR}" test
}

run_test

# TODO: replace with an infinite loop using inotifywatch to avoid multiple
# executions
inotifywait -mqr \
  --event modify \
  "${CIRCUITS_ROOT_DIR}" |
  while read -r; do
    clear && run_test
  done
