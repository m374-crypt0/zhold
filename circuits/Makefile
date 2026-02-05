# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
CIRCUITS_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/help.sh

.PHONY: clean
clean:
	@rm -rf ${CIRCUITS_ROOT_DIR}target

.PHONY: compile
compile: clean
	@cd ${CIRCUITS_ROOT_DIR} && nargo compile

.PHONY: generate_solidity_verifier
generate_solidity_verifier: compile
	@bun run ${CIRCUITS_ROOT_DIR}solidity_verifier_generator/generator.ts ${CIRCUITS_ROOT_DIR}target/Verifier.sol

.PHONY: test
test:
	@cd ${CIRCUITS_ROOT_DIR} && nargo test

.PHONY: watch
watch:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/watch.sh
