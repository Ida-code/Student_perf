pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ida-code/Student_perf.git'
            }
        }

        stage('Build & Deploy') {
            steps {
                bat '''
                docker rm -f DOCKER-MYSQL || exit 0
                docker rm -f php-backend || exit 0
                docker rm -f react-frontend || exit 0

                docker-compose down || exit 0
                docker-compose up -d --build
                '''
            }
        }
    }
}




pipeline {
    agent any

    triggers {
        // This tells Jenkins to build when it receives a GitHub webhook push
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                // Using the specific SCM checkout syntax with your credentialsId
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'githubtoken', 
                        url: 'https://github.com/Ida-code/Student_perf.git'
                    ]]
                )
            }
        }

        stage('Build & Deploy') {
            steps {
                bat '''
                @echo off
                :: Stop and remove existing containers if they exist
                docker-compose down --remove-orphans
                
                :: Rebuild and start services in detached mode
                docker-compose up -d --build
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Check the Docker logs.'
        }
    }
}
