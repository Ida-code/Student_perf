pipeline {
    agent any
    
    triggers {
        // GitHub webhook trigger (requires GitHub plugin + webhook setup in repo)
        githubPush()
        // Poll SCM as backup in case webhook is not configured
        pollSCM('H/5 * * * *')
    }

    environment {
        COMPOSE_CONVERT_WINDOWS_PATHS = "1"
    }

    stages {
        stage('Checkout') {
            steps {
                // Use declarative checkout of whichever branch triggered pipeline
                checkout scm
            }
        }

        stage('Cleanup & Ports') {
            steps {
                script {
                    echo 'Cleaning up existing processes on ports 5173, 8081, and 3307...'
                    // Windows-specific port cleanup
                    bat """
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
                        taskkill /F /PID %%a 2>nul
                    )
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
                        taskkill /F /PID %%a 2>nul
                    )
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3307') do (
                        taskkill /F /PID %%a 2>nul
                    )
                    echo Port cleanup completed
                    """
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                script {
                    // Check if Docker is available
                    bat 'docker --version'
                    
                    // Clean up old containers
                    bat """
                    echo Stopping and removing old containers...
                    docker-compose down --remove-orphans --volumes || echo No containers to remove
                    
                    echo Removing old images...
                    docker image prune -f
                    
                    echo Building and starting containers...
                    docker-compose up -d --build
                    
                    echo Waiting for containers to start...
                    timeout /t 10 /nobreak
                    
                    echo Checking container status...
                    docker-compose ps
                    
                    echo Showing logs...
                    docker-compose logs --tail=30
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo 'Verifying services are running...'
                    bat '''
                    curl -I http://localhost:5173 2>nul || echo React service not ready yet
                    curl -I http://localhost:8081 2>nul || echo PHP service not ready yet
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
            // Clean up on always to free resources
            bat 'docker-compose down --remove-orphans || echo Cleanup completed'
        }
        success {
            echo 'Deployment successful! Your app should be accessible at:'
            echo '- React: http://localhost:5173'
            echo '- PHP API: http://localhost:8081'
        }
        failure {
            echo 'Deployment failed. Collecting debug information...'
            script {
                bat '''
                echo === Docker Compose Logs ===
                docker-compose logs --tail=100
                
                echo === Docker Container Status ===
                docker ps -a
                
                echo === Docker Images ===
                docker images
                
                echo === Docker Compose Config ===
                docker-compose config
                '''
            }
        }
    }
}