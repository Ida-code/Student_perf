pipeline {
    agent any

    environment {
        COMPOSE_CONVERT_WINDOWS_PATHS = "1"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup & Ports') {
            steps {
                script {
                    echo 'Cleaning up existing processes on ports 5173, 8081, and 3307...'
                    // Using PowerShell for a cleaner, safer cleanup
                    powershell '''
                    $ports = @(5173, 8081, 3307)
                    foreach ($port in $ports) {
                        $p = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
                        if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
                    }
                    '''
                }
            }
        }

        stage('Docker Deploy') {
    steps {
        script {
            // 1. Clear the corrupted build cache causing the 'Snapshot' error
            
            
            // 2. Kill any "zombie" containers and start fresh
            echo 'Building and starting containers...'
            bat 'docker-compose up -d --build'
            
            // 3. Jenkins-safe wait (Replaces 'timeout /t 10' which crashes Jenkins)
            echo 'Waiting for services to initialize...'
            sleep time: 15, unit: 'SECONDS'
            
            bat 'docker-compose ps'
        }
    }
}

        stage('Verify Deployment') {
            steps {
                script {
                    echo 'Verifying services via Curl...'
                    bat '''
                    curl -I http://localhost:5173 2>nul || echo "React service NOT responding"
                    curl -I http://localhost:8081 2>nul || echo "PHP service NOT responding"
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment failed. Keeping containers up for debugging.'
            bat 'docker-compose logs --tail=50'
        }
        success {
            echo 'Deployment successful! Containers are running in Docker Desktop.'
            echo '- React: http://localhost:5173'
            echo '- PHP API: http://localhost:8081'
        }
        // REMOVED 'always { docker-compose down }' to keep containers alive
    }
}