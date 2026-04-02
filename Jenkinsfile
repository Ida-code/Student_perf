pipeline {
    agent any

    environment {
        // Force Jenkins to use the TCP port we opened in Docker Settings
        DOCKER_HOST = 'tcp://127.0.0.1:2375'
        
        // Disable BuildKit to avoid the "pipe/BuildServer" errors on Windows
        DOCKER_BUILDKIT = '0'
        COMPOSE_HTTP_TIMEOUT = '200'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Deploy') {
            steps {
                bat 'docker-compose down'
                // --build ensures your React/PHP changes are actually applied
                bat 'docker-compose up -d --build'
            }
        }
        
        stage('Verify Deployment') {
            steps {
                bat 'docker ps'
            }
        }
    }
}