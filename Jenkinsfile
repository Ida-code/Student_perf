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
        stage('Test Cases') {
    steps {
        // Point to the PHPUnit batch file AND the absolute path of your test file
        bat '"C:\\Users\\idash\\Demo_Project\\Stud_Perf\\vendor\\bin\\phpunit.bat" "C:\\Users\\idash\\Demo_Project\\Stud_Perf\\tests\\DatabaseTest.php"'
    }
}

       stage('Docker Deploy') {
    environment {
        // This tells Docker to talk to your local Docker Desktop engine
        DOCKER_HOST = 'tcp://127.0.0.1:2375'
    }
    steps {
        // Use the absolute path to the docker executable
        bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down'
        bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d --build'
    }
}
        
        stage('Verify Deployment') {
            steps {
                bat 'docker ps'
            }
        }
    }
}