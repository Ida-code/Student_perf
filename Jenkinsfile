pipeline {
    agent any
    
    triggers {
        // Automatically starts the build when GitHub sends a webhook ping
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your repository
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

        stage('Cleanup & Ports') {
            steps {
                script {
                    echo 'Cleaning up existing processes on ports 5173, 8081, and 3307...'
                    // This PowerShell block finds any process using your app ports and kills them
                    // This ensures 'localhost:5173' is free for the new Docker container
                    bat """
                    powershell -Command "Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }"
                    powershell -Command "Get-NetTCPConnection -LocalPort 3307 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }"
                    powershell -Command "Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }"
                    """
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                bat '''
                @echo off
                :: Stop and remove old containers and networks for this project
                docker-compose down --remove-orphans || exit 0
                
                :: Build the new images and start containers in detached mode
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
            echo 'Deployment successful! Your app is live at http://localhost:5173'
        }
        failure {
            echo 'Deployment failed. Check the Jenkins console and Docker logs.'
        }
    }
}