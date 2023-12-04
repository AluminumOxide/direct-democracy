terraform {
	required_providers {
		docker = {
			source = "kreuzwerker/docker"
			version = "~> 2.13.0"
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
	create_duration = "5s"
	triggers = {
		always_run = "${timestamp()}"
	}
}

provider "docker" {}

resource "docker_network" "db-network" {
	name = "db-network"
}

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
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	networks_advanced { 
		name = "db-network"
	}
	ports {
		internal = 5432
		external = 5432
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
		"DB_NETWORK=db-network",
		"API_EXTERNAL_NAME=api-external",
		"API_EXTERNAL_URL=0.0.0.0",
		"API_EXTERNAL_PORT=3000",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api/source")
		container_path = "/app"
	}
	networks_advanced { 
		name = "db-network"
	}
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
		"DB_NAME=local-database",
		"API_DEMOCRACY_NAME=api-democracy",
		"API_DEMOCRACY_URL=0.0.0.0",
		"API_DEMOCRACY_PORT=3001",
		"DB_DEMOCRACY_USER=democracy",
		"DB_DEMOCRACY_DB=democracy",
		"DB_DEMOCRACY_PASSWORD=democracy",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-democracy/source")
		container_path = "/app"
	}
	networks_advanced { 
		name = "db-network"
	}
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
		"DB_NAME=local-database",
		"API_PROPOSAL_NAME=api-proposal",
		"API_PROPOSAL_URL=0.0.0.0",
		"API_PROPOSAL_PORT=3002",
		"DB_PROPOSAL_USER=proposal",
		"DB_PROPOSAL_DB=proposal",
		"DB_PROPOSAL_PASSWORD=proposal",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-proposal/source")
		container_path = "/app"
	}
	networks_advanced { 
		name = "db-network"
	}
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
		"DB_NAME=local-database",
		"API_MEMBERSHIP_NAME=api-membership",
		"API_MEMBERSHIP_URL=0.0.0.0",
		"API_MEMBERSHIP_PORT=3003",
		"DB_MEMBERSHIP_USER=membership",
		"DB_MEMBERSHIP_DB=membership",
		"DB_MEMBERSHIP_PASSWORD=membership",
		"TEST_CONNECTION_STRING=postgres://postgres:postgres@local-database:5432/postgres",
	]
	volumes {
		host_path = abspath("../../services/api-membership/source")
		container_path = "/app"
	}
	networks_advanced { 
		name = "db-network"
	}
	ports {
		internal = 3003
		external = 3003
	}
}
