#!/bin/env bash

set -o pipefail

# shellcheck source=./internals_.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/internals_.sh

# shellcheck source=./hof/transform.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/transform.sh

# shellcheck source=./hof/fold.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/fold.sh

# shellcheck source=./hof/filter.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/filter.sh

# shellcheck source=./hof/partition.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/hof/partition.sh

# shellcheck source=./utility/list.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/utility/list.sh

# shellcheck source=./utility/stream.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/utility/stream.sh

# shellcheck source=./monad/operations.sh
. "${FUNCSHIONAL_ROOT_DIR}"src/monad/operations.sh
