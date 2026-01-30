# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
RAKE_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

# TODO: specific dependency setup
FUNCSHIONAL_ROOT_DIR := ${RAKE_ROOT_DIR}.rake/scripts/lib/funcshional/

export

# simple targets
# TODO: first, present compound targets then simple targets that are more for
# internal purposes
.PHONY: help
help:
	@. ${RAKE_ROOT_DIR}.rake/scripts/help.sh

# compound targets are forwarded to a potential sub
# NOTE: This FORCE target is to correctly handle subs that are directory and as
# such, considered up to date for make
.PHONY: FORCE
FORCE:;

%: FORCE
	@. ${RAKE_ROOT_DIR}.rake/scripts/forward_to_sub.sh $@
