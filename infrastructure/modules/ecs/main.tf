# Compute Layer
# Creates an ECS Fargate cluster with two services:
#   frontend — Nginx + Vite SPA (port 80)
#   backend  — Node.js Express API (port 5000)


resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = { Name = "${var.app_name}-${var.environment}-cluster" }
}

# CloudWatch Log Groups 
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.app_name}-${var.environment}/frontend"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.app_name}-${var.environment}/backend"
  retention_in_days = 30
}

# Frontend Task Definition 

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.app_name}-${var.environment}-frontend"
  network_mode             = "awsvpc"        # each task gets its own ENI (required for Fargate)
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = var.task_execution_role_arn   # pulls images, writes logs
  task_role_arn            = var.task_role_arn              # app-level AWS API access

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = var.frontend_image
    essential = true
    portMappings = [{
      containerPort = 80
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.frontend.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "frontend"
      }
    }
    environment = [
      { name = "NODE_ENV", value = "production" }
    ]
    # healthCheck ensures ALB only routes to healthy containers
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost/ || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])
}

#  Backend Task Definition 
# Secrets are injected as environment variables at runtime from Secrets Manager.
# The task never has the secret values baked into the image or task definition —
# they are fetched live when the container starts.
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.app_name}-${var.environment}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([{
    name      = "backend"
    image     = var.backend_image
    essential = true
    portMappings = [{
      containerPort = 5000
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.backend.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "backend"
      }
    }
    environment = [
      { name = "NODE_ENV",    value = "production" },
      { name = "PORT",        value = "5000" },
      { name = "CLIENT_URL",  value = var.client_url }
    ]
    # Secrets from AWS Secrets Manager — injected as env vars, never in plaintext
    secrets = [
      { name = "MONGO_URI",              valueFrom = var.mongo_uri_secret_arn },
      { name = "REDIS_URL",              valueFrom = var.redis_url_secret_arn },
      { name = "ACCESS_TOKEN_SECRET",    valueFrom = "${var.jwt_secrets_arn}:ACCESS_TOKEN_SECRET::" },
      { name = "REFRESH_TOKEN_SECRET",   valueFrom = "${var.jwt_secrets_arn}:REFRESH_TOKEN_SECRET::" },
      { name = "STRIPE_SECRET_KEY",      valueFrom = "${var.stripe_key_arn}:STRIPE_SECRET_KEY::" },
      { name = "CLOUDINARY_CLOUD_NAME",  valueFrom = "${var.cloudinary_creds_arn}:CLOUDINARY_CLOUD_NAME::" },
      { name = "CLOUDINARY_API_KEY",     valueFrom = "${var.cloudinary_creds_arn}:CLOUDINARY_API_KEY::" },
      { name = "CLOUDINARY_API_SECRET",  valueFrom = "${var.cloudinary_creds_arn}:CLOUDINARY_API_SECRET::" }
    ]
    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:5000/api/health || exit 1"]
      interval    = 30
      timeout     = 10
      retries     = 3
      startPeriod = 60
    }
  }])
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.app_name}-${var.environment}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"


  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true    # stop the deploy if health checks fail
    rollback = true    # automatically revert to the previous working version
  }

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [var.app_sg_id]
    assign_public_ip = false   # no public IP — only reachable from ALB
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
    # CI manages image tags and scale, not Terraform
  }
}

resource "aws_ecs_service" "backend" {
  name            = "${var.app_name}-${var.environment}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [var.app_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = 5000
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}



resource "aws_appautoscaling_target" "frontend" {
  max_capacity       = 10
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "frontend_cpu" {
  name               = "${var.app_name}-${var.environment}-frontend-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend.resource_id
  scalable_dimension = aws_appautoscaling_target.frontend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70   # scale out when average CPU hits 70%
    scale_in_cooldown  = 300  
    scale_out_cooldown = 60   
  }
}

resource "aws_appautoscaling_target" "backend" {
  max_capacity       = 10
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  name               = "${var.app_name}-${var.environment}-backend-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
