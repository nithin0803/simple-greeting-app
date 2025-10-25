pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID    = '471112647037'
        AWS_REGION        = 'ap-south-1'
        ECR_REPOSITORY    = 'my-repos/greeting-app'

        ECS_CLUSTER_NAME  = 'grreting-app'
        ECS_SERVICE_NAME  = 'greeting-app-service'
        ECS_CONTAINER_NAME = 'greeting-react-app'
        IMAGE_TAG         = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        ECR_IMAGE_URI     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"
    }
    stages{
  stage('Build & Push Image'){
        steps {
                script {
                    withAWS(credentials: 'aws-jenkins-creds', region: env.AWS_REGION)  {
                        sh "aws ecr get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                    }

                    sh "docker build -t greeting-app:latest ."
                    sh "docker tag greeting-app:latest ${env.ECR_IMAGE_URI}"
                    sh "docker tag greeting-app:latest ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPOSITORY}:latest"
                    sh "docker push ${env.ECR_IMAGE_URI}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPOSITORY}:latest"
                }}
                
    }
    stage('Deploy to ECS') {
        steps {
                script {
                    def taskDefJson = libraryResource('task-definition.json')
                    def updatedTaskDef = taskDefJson.replace("<IMAGE_PLACEHOLDER>", env.ECR_IMAGE_URI)
                    writeFile file: 'task-definition-new.json', text: updatedTaskDef
                    def newRevisionOutput = sh(
                        returnStdout: true,
                        script: "aws ecs register-task-definition --cli-input-json file://task-definition-new.json --region ${env.AWS_REGION}"
                    ).trim()
                    def newTdArn = sh(returnStdout: true, script: "echo '${newRevisionOutput}' | jq -r '.taskDefinition.taskDefinitionArn'")
                    sh "aws ecs update-service --cluster ${env.ECS_CLUSTER_NAME} --service ${env.ECS_SERVICE_NAME} --task-definition ${newTdArn} --region ${env.AWS_REGION}"
                }
                
            }

    }
    }
  
}