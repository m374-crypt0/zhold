LOCAL_ROOT_DIR := ${ZK_ASSETS_ROOT_DIR}run/integration/tests/between/customer/and/local/

include $(ZK_ASSETS_ROOT_DIR)contracts/.env

export

.PHONY: blockchain
blockchain: COVERAGE=false
blockchain:
	@. ${LOCAL_ROOT_DIR}main.sh
