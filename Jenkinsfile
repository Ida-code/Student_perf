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
