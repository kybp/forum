resource "aws_s3_bucket" "forum" {
  bucket = "tf-forum-bucket"
}

resource "aws_s3_object_copy" "lambda_promtail_zipfile" {
  bucket = aws_s3_bucket.forum.bucket
  key    = "lambda-promtail.zip"
  source = "grafanalabs-cf-templates/lambda-promtail/lambda-promtail.zip"
}

resource "aws_iam_role" "lambda_promtail_role" {
  name = "GrafanaLabsCloudWatchLogsIntegration"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_promtail_policy_logs" {
  name = "lambda-logs"
  role = aws_iam_role.lambda_promtail_role.name

  policy = jsonencode({
    "Statement" : [
      {
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:logs:*:*:*",
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "lambda_promtail_log_group" {
  name              = "/aws/lambda/GrafanaCloudLambdaPromtail"
  retention_in_days = 14
}

resource "aws_lambda_function" "lambda_promtail" {
  function_name = "GrafanaCloudLambdaPromtail"
  role          = aws_iam_role.lambda_promtail_role.arn

  timeout     = 60
  memory_size = 128

  handler   = "main"
  runtime   = "go1.x"
  s3_bucket = aws_s3_object_copy.lambda_promtail_zipfile.bucket
  s3_key    = aws_s3_object_copy.lambda_promtail_zipfile.key

  environment {
    variables = {
      WRITE_ADDRESS = "${grafana_cloud_stack.forum.logs_url}/loki/api/v1/push"
      USERNAME      = "${grafana_cloud_stack.forum.logs_user_id}"
      PASSWORD      = var.grafana_api_key
      KEEP_STREAM   = "true"
    }
  }

  depends_on = [
    aws_s3_object_copy.lambda_promtail_zipfile,
    aws_iam_role_policy.lambda_promtail_policy_logs,

    # Ensure function is created after, and destroyed before, the log
    # group. This prevents the log group from being re-created by an
    # invocation of the lambda function.
    aws_cloudwatch_log_group.lambda_promtail_log_group,
  ]
}

resource "aws_lambda_function_event_invoke_config" "lambda_promtail_invoke_config" {
  function_name          = aws_lambda_function.lambda_promtail.function_name
  maximum_retry_attempts = 2
}

resource "aws_lambda_permission" "lambda_promtail_allow_cloudwatch" {
  statement_id  = "lambda-promtail-allow-cloudwatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_promtail.function_name
  principal     = "logs.${var.aws_region}.amazonaws.com"
}

resource "aws_cloudwatch_log_subscription_filter" "lambda_promtail_logfilter" {
  name            = "lambda_promtail_logfilter_forum"
  log_group_name  = "forum"
  destination_arn = aws_lambda_function.lambda_promtail.arn
  # required but can be empty string
  filter_pattern = ""
  depends_on     = [aws_iam_role_policy.lambda_promtail_policy_logs]
}

resource "aws_cloudwatch_log_subscription_filter" "rds_logfilter" {
  name            = "rds_logfilter_forum"
  log_group_name  = "/aws/rds/instance/${aws_db_instance.forum.identifier}/postgresql"
  destination_arn = aws_lambda_function.lambda_promtail.arn
  # required but can be empty string
  filter_pattern = ""
  depends_on     = [aws_iam_role_policy.lambda_promtail_policy_logs]
}
