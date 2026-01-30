MAKEFLAGS += --no-print-directory

SUB_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

SHELL := /bin/bash

export

.PHONY: list
list:
	@. ${SUB_ROOT_DIR}scripts/list.sh
