variable "app_name"        { type = string }
variable "environment"     { type = string }
variable "aws_region"      { type = string }
variable "aws_account_id"  { type = string }
variable "frontend_ecr_arn" { type = string }
variable "backend_ecr_arn"  { type = string }



output "ecs_task_execution_role_arn" { value = aws_iam_role.ecs_task_execution.arn }
output "ecs_task_role_arn"           { value = aws_iam_role.ecs_task.arn }
output "github_actions_role_arn"     { value = aws_iam_role.github_actions.arn }
