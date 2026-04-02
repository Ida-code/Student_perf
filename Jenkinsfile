pipeline {
    agent any

  environment {
    // We use the 'docker_engine' pipe for general commands
    // Jenkins handles this better than the BuildServer pipe
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