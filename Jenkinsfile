pipeline {
    agent any

   environment {
    // This uses the direct Windows "tunnel" instead of the network port
    DOCKER_HOST = 'npipe:////./pipe/docker_engine'
    DOCKER_BUILDKIT = '0'
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