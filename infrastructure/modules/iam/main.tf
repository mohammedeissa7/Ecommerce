# IAM module: roles and policies for ECS tasks
# 1. ECS Task Execution Role — what ECS itself needs to START a task:
#    pull Docker images from ECR, write logs to CloudWatch, fetch secrets.
#
# 2. ECS Task Role — what the running APPLICATION can do:
#    call AWS APIs from inside the container (e.g. S3 read for assets).


#  ECS Task Execution Role 
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.app_name}-${var.environment}-ecs-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# AWS managed policy covers: ECR auth, image pull, CloudWatch log write
resource "aws_iam_role_policy_attachment" "ecs_execution_managed" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional policy: read specific Secrets Manager secrets
resource "aws_iam_role_policy" "ecs_secrets" {
  name = "${var.app_name}-${var.environment}-ecs-secrets"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ]
      Resource = [
        "arn:aws:secretsmanager:${var.aws_region}:${var.aws_account_id}:secret:${var.app_name}/*"
      ]
    }]
  })
}

#  ECS Task Role 
resource "aws_iam_role" "ecs_task" {
  name = "${var.app_name}-${var.environment}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# S3 read for static asset access
resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "${var.app_name}-${var.environment}-ecs-s3"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:ListBucket"]
      Resource = [
        "arn:aws:s3:::${var.app_name}-${var.environment}-assets",
        "arn:aws:s3:::${var.app_name}-${var.environment}-assets/*"
      ]
    }]
  })
}

