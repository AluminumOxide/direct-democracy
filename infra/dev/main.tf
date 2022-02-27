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
		"ENV=local",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=local-database",
		"DB_DEFAULT_USER=postgres",
		"DB_DEFAULT_DB=postgres",
		"POSTGRES_PASSWORD=postgres",
		"DB_DEMOCRACY_USER=democracy",
		"DB_DEMOCRACY_DB=democracy",
		"DB_DEMOCRACY_PASSWORD=democracy",
		"DB_PROPOSAL_USER=proposal",
		"DB_PROPOSAL_DB=proposal",
		"DB_PROPOSAL_PASSWORD=proposal"
	]
	networks_advanced { 
		name = "db-network"
	}
	ports {
		internal = 5432
		external = 5432
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
		"ENV=local",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=local-database",
		"API_DEMOCRACY_NAME=api-democracy",
		"API_DEMOCRACY_URL=0.0.0.0",
		"API_DEMOCRACY_PORT=3000",
		"DB_DEMOCRACY_USER=democracy",
		"DB_DEMOCRACY_DB=democracy",
		"DB_DEMOCRACY_PASSWORD=democracy",
	]
	volumes {
		host_path = abspath("../../services/api-democracy/source")
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
		"ENV=local",
		"DB_NETWORK=db-network",
		"DB_PORT=5432",
		"DB_NAME=local-database",
		"API_PROPOSAL_NAME=api-proposal",
		"API_PROPOSAL_URL=0.0.0.0",
		"API_PROPOSAL_PORT=3001",
		"DB_PROPOSAL_USER=proposal",
		"DB_PROPOSAL_DB=proposal",
		"DB_PROPOSAL_PASSWORD=proposal",
	]
	volumes {
		host_path = abspath("../../services/api-proposal/source")
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
