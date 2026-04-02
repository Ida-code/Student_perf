pipeline {
    agent any

    environment {
        DOCKER_HOST = 'npipe:////./pipe/docker_engine'
        DOCKER_BUILDKIT = '0'
        // Pointing to your Jenkins Docker config
        DOCKER_CONFIG = 'C:\\ProgramData\\Jenkins\\.jenkins\\.docker'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

     stage('Docker Deploy') {
            steps {
                // 1. Shut down any old containers and rebuild fresh
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down'
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d --build'
                
                // 2. Updated Wait Command
                echo 'Waiting 20 seconds for Database to initialize...'
                bat 'ping 127.0.0.1 -n 20 > nul' 
            }
        }

        stage('Test Cases') {
            steps {
                // Now that Docker is UP and the DB is READY, run the tests
                bat '"C:\\Users\\idash\\Demo_Project\\Stud_Perf\\vendor\\bin\\phpunit.bat" "C:\\Users\\idash\\Demo_Project\\Stud_Perf\\tests\\DatabaseTest.php"'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'docker ps'
            }
        }
    }
}