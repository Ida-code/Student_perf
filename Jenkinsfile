pipeline {
    agent any

    // Ensure the NodeJS tool is defined in Manage Jenkins > Tools with the name 'node'
    tools {
        nodejs 'node'
    }

    environment {
        // Docker Configuration
        DOCKER_HOST = 'npipe:////./pipe/docker_engine'
        DOCKER_BUILDKIT = '0' 
        DOCKER_CONFIG = 'C:\\ProgramData\\Jenkins\\.jenkins\\.docker'
        
        // Absolute path to the Docker executable on your Windows machine
        DOCKER_EXE = '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
        
        // Absolute paths for PHPUnit and your local project test files
        PHPUNIT_BIN = '"C:\\Users\\idash\\Demo_Project\\Stud_Perf\\vendor\\bin\\phpunit.bat"'
        DATABASE_TEST = '"C:\\Users\\idash\\Demo_Project\\Stud_Perf\\tests\\DatabaseTest.php"'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Pulls the latest code from your GitHub Repo
                checkout scm
            }
        }

        stage('Frontend Tests') {
    steps {
        script {
            // Run from the workspace root where package.json lives
            bat 'npm install --legacy-peer-deps'
            
            // If Vitest is also configured in the root package.json:
            bat 'npx vitest run'
            
            // Keep this for one run to verify your file locations in the log
            bat 'dir' 
        }
    }
}

        stage('Docker Deploy') {
            steps {
                // Shut down any existing containers to ensure a clean slate
                bat "${env.DOCKER_EXE} compose down"
                
                // Build and start the containers in detached mode
                bat "${env.DOCKER_EXE} compose up -d --build"
                
                // Critical SCM Step: Wait for MySQL to initialize before running tests
                echo 'Waiting 20 seconds for Database and Services to stabilize...'
                bat 'ping 127.0.0.1 -n 21 > nul' 
            }
        }

        stage('Backend & DB Tests') {
            steps {
                // Runs the PHPUnit test against the live Docker Database
                // Using 127.0.0.1:3307 inside your DatabaseTest.php logic
                bat "${env.PHPUNIT_BIN} ${env.DATABASE_TEST}"
            }
        }
        
        stage('Verify Deployment') {
            steps {
                // Final audit check to see if containers are UP and Healthy
                bat "${env.DOCKER_EXE} ps"
                echo "Deployment Successful: Student Performance Tracking System is Live."
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete. Checking logs...'
        }
        failure {
            echo 'Pipeline Failed. Please check the Console Output for debugging.'
        }
    }
}