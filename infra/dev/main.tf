terraform {
	required_providers {
		docker = {
			source = "kreuzwerker/docker"
			version = "3.6.2"
		}
	}
}

resource "null_resource" "build-docker" {
	triggers = {
		always_run = "${timestamp()}"
	}
	provisioner "local-exec" {
		command = "./build_docker.sh"
	}
}

resource "time_sleep" "wait_5_seconds" {
	depends_on = [ null_resource.build-docker ]
	create_duration = "2s"
	triggers = {
		always_run = "${timestamp()}"
	}
}

provider "docker" {}

resource "docker_image" "local-database" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "postgres:latest"
	keep_locally = false
}

resource "docker_container" "local-database" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "local-database:latest"
	name = "local-database"
	env = [
		"ENV=dev",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=local-database",
		"DB_DEFAULT_USER=postgres",
		"DB_DEFAULT_DB=postgres",
		"POSTGRES_PASSWORD=postgres",
		"DB_DEMOCRACY_USER=democracy",
		"DB_DEMOCRACY_DB=democracy",
		"DB_DEMOCRACY_PASSWORD=democracy",
		"DB_MEMBERSHIP_USER=membership",
		"DB_MEMBERSHIP_DB=membership",
		"DB_MEMBERSHIP_PASSWORD=membership",
		"DB_PROPOSAL_USER=proposal",
		"DB_PROPOSAL_DB=proposal",
		"DB_PROPOSAL_PASSWORD=proposal",
		"DB_ACCOUNT_USER=account",
		"DB_ACCOUNT_DB=account",
		"DB_ACCOUNT_PASSWORD=account",
		"DB_PROFILE_USER=profile",
		"DB_PROFILE_DB=profile",
		"DB_PROFILE_PASSWORD=profile",
		"DB_TOKEN_USER=token",
		"DB_TOKEN_DB=token",
		"DB_TOKEN_PASSWORD=token",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	hostname = "local-database"
	network_mode = "host"
	ports {
		internal = 5432
		external = 5432
	}
}

resource "docker_image" "ui" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "ui:latest"
	keep_locally = false
}

resource "docker_container" "ui" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "ui:latest"
	name = "ui"
	env = [
		"ENV=local",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"DB_NETWORK=db-network",
		"API_EXTERNAL_NAME=api-external",
		"API_EXTERNAL_URL=0.0.0.0",
		"API_EXTERNAL_PORT=3000",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/ui")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 8081
		external = 8081
	}
}

resource "docker_image" "api-external" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-external:latest"
	keep_locally = false
}

resource "docker_container" "api-external" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-external:latest"
	name = "api-external"
	env = [
		"ENV=dev",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"DB_NETWORK=db-network",
		"API_EXTERNAL_NAME=api-external",
		"API_EXTERNAL_URL=0.0.0.0",
		"API_EXTERNAL_PORT=3000",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3000
		external = 3000
	}
}

resource "docker_image" "api-democracy" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-democracy:latest"
	keep_locally = false
}

resource "docker_container" "api-democracy" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-democracy:latest"
	name = "api-democracy"
	env = [
		"ENV=dev",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"API_DEMOCRACY_NAME=api-democracy",
		"API_DEMOCRACY_URL=0.0.0.0",
		"API_DEMOCRACY_PORT=3001",
		"DB_DEMOCRACY_USER=democracy",
		"DB_DEMOCRACY_DB=democracy",
		"DB_DEMOCRACY_PASSWORD=democracy",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-democracy/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3001
		external = 3001
	}
}

resource "docker_image" "api-proposal" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-proposal:latest"
	keep_locally = false
}

resource "docker_container" "api-proposal" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-proposal:latest"
	name = "api-proposal"
	env = [
		"ENV=dev",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"API_PROPOSAL_NAME=api-proposal",
		"API_PROPOSAL_URL=0.0.0.0",
		"API_PROPOSAL_PORT=3002",
		"DB_PROPOSAL_USER=proposal",
		"DB_PROPOSAL_DB=proposal",
		"DB_PROPOSAL_PASSWORD=proposal",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-proposal/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3002
		external = 3002
	}
}

resource "docker_image" "api-membership" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-membership:latest"
	keep_locally = false
}

resource "docker_container" "api-membership" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-membership:latest"
	name = "api-membership"
	env = [
		"ENV=dev",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"API_MEMBERSHIP_NAME=api-membership",
		"API_MEMBERSHIP_URL=0.0.0.0",
		"API_MEMBERSHIP_PORT=3003",
		"DB_MEMBERSHIP_USER=membership",
		"DB_MEMBERSHIP_DB=membership",
		"DB_MEMBERSHIP_PASSWORD=membership",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-membership/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3003
		external = 3003
	}
}

resource "docker_image" "api-account" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-account:latest"
	keep_locally = false
}

resource "docker_container" "api-account" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-account:latest"
	name = "api-account"
	env = [
		"ENV=dev",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"DB_NETWORK=db-network",
		"API_ACCOUNT_NAME=api-account",
		"API_ACCOUNT_URL=0.0.0.0",
		"API_ACCOUNT_PORT=3004",
		"DB_ACCOUNT_USER=account",
		"DB_ACCOUNT_DB=account",
		"DB_ACCOUNT_PASSWORD=account",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-account/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3004
		external = 3004
	}
}

resource "docker_image" "api-profile" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-profile:latest"
	keep_locally = false
}

resource "docker_container" "api-profile" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-profile:latest"
	name = "api-profile"
	env = [
		"ENV=dev",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"DB_NETWORK=db-network",
		"API_PROFILE_NAME=api-profile",
		"API_PROFILE_URL=0.0.0.0",
		"API_PROFILE_PORT=3005",
		"DB_PROFILE_USER=profile",
		"DB_PROFILE_DB=profile",
		"DB_PROFILE_PASSWORD=profile",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-profile/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3005
		external = 3005
	}
}

resource "docker_image" "api-token" {
	depends_on = [ time_sleep.wait_5_seconds ]
	name = "api-token:latest"
	keep_locally = false
}

resource "docker_container" "api-token" {
	depends_on = [ time_sleep.wait_5_seconds ]
	image = "api-token:latest"
	name = "api-token"
	env = [
		"ENV=dev",
		"DB_PORT=5432",
		"DB_NAME=0.0.0.0",
		"DB_NETWORK=db-network",
		"DB_TOKEN_USER=token",
		"DB_TOKEN_DB=token",
		"DB_TOKEN_PASSWORD=token",
		"API_TOKEN_NAME=api-token",
		"API_TOKEN_URL=0.0.0.0",
		"API_TOKEN_PORT=3006",
		"NODE_EXTRA_CA_CERTS=./certs/ssl.pem",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@0.0.0.0:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-token/source")
		container_path = "/app"
	}
	network_mode = "host"
	ports {
		internal = 3006
		external = 3006
	}
}

resource "null_resource" "build-cert" {
	depends_on = [
		docker_container.api-external,
		docker_container.api-democracy,
		docker_container.api-proposal,
		docker_container.api-membership,
		docker_container.api-account,
		docker_container.api-profile,
		docker_container.api-token
	]
	triggers = {
		always_run = "${timestamp()}"
	}
	provisioner "local-exec" {
		command = "./build_certs.sh"
	}
}
