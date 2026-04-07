# Observability
# Covers the complete set of monitoring required:
#   - SNS topic for alarm notifications (email)
#   - CloudWatch alarms for ECS, ALB, and DocumentDB
#   - Budget alert to catch unexpected cost spikes
#   - GuardDuty for threat detection
#   - IAM Access Analyzer

# SNS Topic — all alarms notify this topic 
# Create one topic and subscribe your team's email.
# All CloudWatch alarms send to the same topic to simplify routing.
resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-${var.environment}-alerts"
  tags = { Name = "${var.app_name}-${var.environment}-alerts" }
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email   # add this variable to variables.tf
}

# CloudWatch Alarms 
# ALB 5xx errors — fires when error rate exceeds 1% of total requests.
# A sustained 5xx rate means the backend is crashing or overloaded.
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.app_name}-${var.environment}-alb-5xx-high"
  alarm_description   = "ALB 5xx error rate > 1% for 5 minutes"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "HTTPCode_Target_5XX_Count"
  statistic           = "Sum"
  period              = 300   # 5-minute window
  evaluation_periods  = 1
  threshold           = 10    # more than 10 errors in 5 min
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    LoadBalancer = module.alb.arn
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]   # also notify when recovered
}

# ECS Backend CPU — sustained high CPU usually means a traffic spike or memory leak
resource "aws_cloudwatch_metric_alarm" "backend_cpu" {
  alarm_name          = "${var.app_name}-${var.environment}-backend-cpu-high"
  alarm_description   = "Backend ECS CPU > 80% for 10 minutes"
  namespace           = "AWS/ECS"
  metric_name         = "CPUUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2   # must breach for two consecutive 5-min periods
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = module.ecs.cluster_name
    ServiceName = module.ecs.backend_service_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# ECS Backend Memory — OOM kills cause container restarts
resource "aws_cloudwatch_metric_alarm" "backend_memory" {
  alarm_name          = "${var.app_name}-${var.environment}-backend-memory-high"
  alarm_description   = "Backend ECS Memory > 85% for 10 minutes"
  namespace           = "AWS/ECS"
  metric_name         = "MemoryUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 85
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = module.ecs.cluster_name
    ServiceName = module.ecs.backend_service_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# DocumentDB connections — approaching max connections means app can't open new DB sessions
resource "aws_cloudwatch_metric_alarm" "docdb_connections" {
  alarm_name          = "${var.app_name}-${var.environment}-docdb-connections-high"
  alarm_description   = "DocumentDB DatabaseConnections > 80% of max"
  namespace           = "AWS/DocDB"
  metric_name         = "DatabaseConnections"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 1
  threshold           = 800   # db.t3.medium max is ~1000
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# ALB Target Response Time — detects slow responses before users notice
resource "aws_cloudwatch_metric_alarm" "alb_latency" {
  alarm_name          = "${var.app_name}-${var.environment}-alb-latency-high"
  alarm_description   = "ALB P99 latency > 3s for 5 minutes"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "TargetResponseTime"
  extended_statistic  = "p99"
  period              = 300
  evaluation_periods  = 1
  threshold           = 3
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    LoadBalancer = module.alb.arn
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# CloudWatch Dashboard 
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.app_name}-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x = 0
        y = 0
        width = 12
        height = 6
        properties = {
          title  = "ECS CPU Utilization"
          period = 300
          stat   = "Average"
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", module.ecs.cluster_name, "ServiceName", module.ecs.frontend_service_name],
            ["AWS/ECS", "CPUUtilization", "ClusterName", module.ecs.cluster_name, "ServiceName", module.ecs.backend_service_name]
          ]
        }
      },
      {
        type   = "metric"
        x = 12
        y = 0
        width = 12
        height = 6
        properties = {
          title  = "ALB Request Count & 5xx Errors"
          period = 300
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", module.alb.arn],
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", module.alb.arn]
          ]
        }
      },
      {
        type   = "metric"
        x = 0
        y = 6
        width = 12
        height = 6
        properties = {
          title  = "ALB Response Time (p50, p99)"
          period = 300
          metrics = [
            [{ "expression" = "SLICE(m1, 0, 1)", "label" = "p50" }],
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", module.alb.arn, { "id" = "m1", "stat" = "p99", "label" = "p99" }]
          ]
        }
      },
      {
        type   = "metric"
        x = 12
        y = 6
        width = 12
        height = 6
        properties = {
          title  = "DocumentDB Connections"
          period = 300
          metrics = [["AWS/DocDB", "DatabaseConnections"]]
        }
      }
    ]
  })
}

# ── AWS Budget Alert — Phase 7 ────────────────────────────────────────────────
# Sends an email when actual monthly spend exceeds $300 (15% above estimate).
# Catches runaway resources (forgotten NAT Gateway, CloudFront spike, etc.)
resource "aws_budgets_budget" "monthly" {
  name         = "${var.app_name}-${var.environment}-monthly-budget"
  budget_type  = "COST"
  limit_amount = "300"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80    # alert at 80% ($240) so you have time to react
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }
}

# GuardDuty 
# Analyses CloudTrail, VPC Flow Logs, and DNS logs for threat patterns.
# Detects: compromised EC2, crypto mining, unusual API calls, port scanning.
# Free for 30 days, then ~$0.004 per 1M events. Cheap insurance.
resource "aws_guardduty_detector" "main" {
  enable = true

  datasources {
    s3_logs {
      enable = true   # detect unusual S3 access patterns
    }
    kubernetes {
      audit_logs { enable = false }   # we use ECS, not EKS
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes { enable = true }
      }
    }
  }

  tags = { Name = "${var.app_name}-${var.environment}-guardduty" }
}

# ── IAM Access Analyzer — Phase 8 ────────────────────────────────────────────
# Continuously scans IAM policies and reports any resource (S3, SQS, KMS, etc.)
# that is accessible from outside the account. Free.
resource "aws_accessanalyzer_analyzer" "main" {
  analyzer_name = "${var.app_name}-${var.environment}-analyzer"
  type          = "ACCOUNT"   # analyzes the entire account
  tags          = { Name = "${var.app_name}-${var.environment}-access-analyzer" }
}
