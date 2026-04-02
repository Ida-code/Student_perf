pipeline {
    agent any

    environment {
        DOCKER_HOST = 'npipe:////./pipe/docker_engine'
        DOCKER_BUILDKIT = '0' 
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
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down'
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d --build'
                
                echo 'Waiting 20 seconds for Database to initialize...'
                // Using ping as a reliable delay for Jenkins on Windows
                bat 'ping 127.0.0.1 -n 21 > nul' 
            }
        }

        stage('Test Cases') {
            steps {
                // This now runs AFTER the DB is ready
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