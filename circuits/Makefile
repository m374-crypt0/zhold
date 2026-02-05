# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
CIRCUITS_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/help.sh

.PHONY: compile
compile:
	@cd ${CIRCUITS_ROOT_DIR} && nargo compile

.PHONY: clean
clean:
	@rm -rf ${CIRCUITS_ROOT_DIR}target

.PHONY: test
test:
	@cd ${CIRCUITS_ROOT_DIR} && nargo test

.PHONY: watch
watch:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/watch.sh
