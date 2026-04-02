pipeline {
    agent any

    environment {
        // Your existing Docker paths
        DOCKER_HOST = 'npipe:////./pipe/docker_engine'
        DOCKER_BUILDKIT = '0' 
        DOCKER_CONFIG = 'C:\\ProgramData\\Jenkins\\.jenkins\\.docker'
        // Add Node to PATH if it's not globally recognized
        NODEJS_HOME = tool name: 'node', type: 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // --- NEW STAGE FOR VITEST ---
        stage('Frontend Tests') {
            steps {
                dir('your-react-app-folder') { // Change this to your React folder name
                    bat 'npm install' 
                    bat 'npx vitest run'
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down'
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d --build'
                
                echo 'Waiting 20 seconds for Database to initialize...'
                bat 'ping 127.0.0.1 -n 21 > nul' 
            }
        }

        stage('Backend & DB Tests') {
            steps {
                // Your existing PHPUnit tests
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