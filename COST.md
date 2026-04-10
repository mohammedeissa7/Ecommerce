# Eissa — AWS Cost Guide

> All prices are **us-east-1 (N. Virginia)**, April 2025.
> Based on ~50k monthly active users, ~100 GB/month egress, ~10M monthly requests.
> Prices are estimates — actual costs vary with traffic, data, and usage patterns.

---

## Quick Summary

| Deployment tier | Monthly cost | Use case |
|---|---|---|
| **Local Docker only** | **$0** | Development |
| **Staging** | **~$85/mo** | Pre-production testing |
| **Production — cost-optimised** | **~$160/mo** | Small-scale live app |
| **Production — standard HA** | **~$259/mo** | Recommended for production |
| **Production — scale-up** | **~$480/mo** | High traffic (500k MAU) |

---

## Production — Standard HA (~$259/month)

This is the recommended configuration from `environments/production/terraform.tfvars`:
`single_nat_gateway = false` · `desired_count = 2` · `documentdb_instance_count = 2`

### Service-by-service breakdown

| # | Service | Configuration | Unit price | Monthly estimate |
|---|---|---|---|---|
| 1 | **ECS Fargate — Frontend** | 2 tasks × 0.25 vCPU / 512 MB, ~720 hrs/mo | $0.04048/vCPU-hr + $0.004445/GB-hr | ~$8 |
| 2 | **ECS Fargate — Backend** | 2 tasks × 0.5 vCPU / 1 GB, ~720 hrs/mo | $0.04048/vCPU-hr + $0.004445/GB-hr | ~$12 |
| 3 | **Application Load Balancer** | 1 ALB, ~10 LCU avg/hr | $0.008/LCU-hr + $0.0225/hr base | ~$22 |
| 4 | **DocumentDB** | db.t3.medium × 2 (primary + replica) | ~$0.083/instance-hr | ~$120 |
| 5 | **ElastiCache Redis** | cache.t3.micro × 1 node | $0.017/node-hr | ~$13 |
| 6 | **NAT Gateway** | 3 NATs (one per AZ) × 100 GB data | $0.045/hr + $0.045/GB | ~$97 |
| 7 | **CloudFront** | 100 GB egress + 10M HTTPS requests | $0.0085/GB + $0.0100/10k req | ~$11 |
| 8 | **Route 53** | 1 hosted zone + 10M queries | $0.50/zone + $0.40/M queries | ~$5 |
| 9 | **ACM Certificate** | 1 wildcard cert | — | **Free** |
| 10 | **ECR** | 2 repos, ~10 GB storage | $0.10/GB-mo | ~$1 |
| 11 | **S3** | 10 GB storage, 1M requests | $0.023/GB + $0.0004/1k req | ~$1 |
| 12 | **Secrets Manager** | 5 secrets, ~30k API calls/mo | $0.40/secret/mo + $0.05/10k calls | ~$3 |
| 13 | **CloudWatch** | Logs (5 GB), metrics, 5 alarms | $0.50/GB logs + $0.10/metric | ~$10 |
| 14 | **AWS WAF** | 1 WebACL + 4 rule groups + 10M requests | $5/WebACL + $1/rule + $0.60/M req | ~$15 |
| 15 | **GuardDuty** | Base + CloudTrail + VPC Flow Logs events | $1.00/M events (approx) | ~$5 |
| 16 | **KMS** | 2 CMKs (DocumentDB + Redis) + API calls | $1.00/key/mo + $0.03/10k calls | ~$3 |
| 17 | **VPC Flow Logs** | ~5 GB/mo logs to CloudWatch | Included in CloudWatch | ~$0 |
| 18 | **Data Transfer** | ~100 GB inter-AZ + egress | $0.01/GB inter-AZ, $0.09/GB egress | ~$9 |
| 19 | **GitHub Actions** | ~1,500 min/mo (free tier: 2,000) | — | **Free** |
| 20 | **Terraform / Ansible** | Open-source, no license cost | — | **Free** |
| | | | | |
| | **Total** | | | **~$335/mo** |

> **Note:** The NAT Gateway cost ($97 with 3 NATs) is the biggest line item variance.
> With `single_nat_gateway = true` this drops to ~$35, saving **~$62/month**.
> Adjusted total with single NAT: **~$273/mo**.

---

## Production — Cost-Optimised (~$160/month)

Apply these changes in `environments/production/terraform.tfvars`:

```hcl
single_nat_gateway        = true    # -$62/mo: one NAT instead of three
documentdb_instance_count = 1       # -$60/mo: no replica (primary only)
```

And use **Fargate Spot** in the ECS service resource (add to `modules/ecs/main.tf`):

```hcl
capacity_provider_strategy {
  capacity_provider = "FARGATE_SPOT"
  weight            = 1
  base              = 0
}
```

| Change | Saving |
|---|---|
| Single NAT Gateway | -$62/mo |
| Remove DocumentDB replica | -$60/mo |
| Fargate Spot (~70% discount on compute) | -$14/mo |
| **Total saving** | **-$136/mo** |

Adjusted cost: **~$335 − $136 = ~$199/mo**

> ⚠️ **Trade-offs:**
> - Single NAT = single AZ outage point for outbound traffic
> - No DB replica = no automatic failover if the primary fails (brief outage)
> - Fargate Spot = tasks can be interrupted with 2-minute warning (not suitable for long-running jobs)

---

## Staging (~$85/month)

Uses `environments/staging/terraform.tfvars`:
`single_nat_gateway = true` · `desired_count = 1` · `documentdb_instance_count = 1`

| Service | Staging config | Cost |
|---|---|---|
| ECS Fargate | 1 task each × smaller CPU/memory | ~$5 |
| ALB | 1 ALB, low traffic | ~$17 |
| DocumentDB | db.t3.medium × 1 (no replica) | ~$60 |
| ElastiCache | cache.t3.micro × 1 | ~$13 |
| NAT Gateway | 1 NAT (single AZ) | ~$35 |
| CloudFront + WAF | Low traffic | ~$7 |
| Everything else | S3, ECR, CloudWatch, etc. | ~$8 |
| | **Total** | **~$145/mo** |

> 💡 **Save more:** Destroy staging when not in use.
> ```bash
> terraform destroy -var-file=environments/staging/terraform.tfvars
> ```
> Recreate before the next testing cycle. Time to recreate: ~15 minutes.
> If you destroy and recreate regularly (e.g. 5 days/week), staging costs ~$52/mo.

---

## Free Tier Impact (First 12 Months)

New AWS accounts get free tier allowances that significantly reduce first-year costs:

| Service | Free tier allowance | Monthly saving |
|---|---|---|
| EC2 / ECS | 750 hrs t2.micro | N/A (using Fargate) |
| S3 | 5 GB storage, 20k GET, 2k PUT | ~$1 |
| CloudWatch | 10 metrics, 5 GB logs, 3 dashboards | ~$5 |
| Secrets Manager | First 30 days free per secret | ~$2 |
| Data Transfer | 1 GB/mo egress free | ~$0.09 |
| GuardDuty | 30-day free trial | ~$5 first month |
| **First year approximate saving** | | **~$13/mo** |

> DocumentDB and ElastiCache have **no free tier** — they are the largest fixed costs.

---

## Cost by Phase (Operational vs. Infrastructure)

### Always-on costs (fixed regardless of traffic)
These run 24/7 and cost the same whether you have 1 user or 50,000:

| Service | Fixed monthly cost |
|---|---|
| DocumentDB (primary only) | ~$60 |
| NAT Gateway base charge | ~$32 (1 NAT) / ~$97 (3 NATs) |
| ALB base charge | ~$16 |
| ElastiCache | ~$13 |
| Route 53 hosted zone | ~$0.50 |
| ACM certificate | Free |
| WAF WebACL | ~$5 |
| Secrets Manager (5 secrets) | ~$2 |
| KMS keys (2) | ~$2 |
| **Fixed total (single NAT)** | **~$131/mo** |

### Traffic-proportional costs (scale with usage)
These grow as your traffic grows:

| Service | Unit | Cost per unit |
|---|---|---|
| ECS Fargate CPU | per vCPU-hour | $0.04048 |
| ECS Fargate Memory | per GB-hour | $0.004445 |
| CloudFront egress | per GB | $0.0085 |
| CloudFront requests | per 10k HTTPS | $0.0100 |
| ALB LCU | per LCU-hour | $0.008 |
| WAF requests | per 1M | $0.60 |
| Data Transfer | per GB egress | $0.09 |
| NAT Gateway data | per GB processed | $0.045 |

---

## Scaling Projections

Cost estimates at different traffic levels (production HA config):

| Monthly Active Users | ECS Tasks | DocumentDB | CloudFront Egress | Estimated Total |
|---|---|---|---|---|
| 5k (launch) | 2+2 tasks | 1 primary | 10 GB | **~$175/mo** |
| 50k (growth) | 2+2 tasks | 1P + 1R | 100 GB | **~$259/mo** |
| 200k (scale) | 4+4 tasks | 1P + 1R | 400 GB | **~$380/mo** |
| 500k (mature) | 6+6 tasks | 1P + 2R | 1 TB | **~$580/mo** |
| 1M+ (large) | Consider EKS | Atlas/self-managed | 2+ TB | **$1,000+/mo** |

> At 1M+ MAU, consider migrating from DocumentDB to self-managed MongoDB on EC2 or MongoDB Atlas — DocumentDB instance costs become the bottleneck.

---

## Biggest Cost Levers

Ranked by impact:

### 1. DocumentDB — $60–120/mo
The single largest fixed cost. Options to reduce:

| Option | Saving | Trade-off |
|---|---|---|
| Remove replica (`instance_count = 1`) | -$60/mo | No automatic failover |
| Downgrade to db.t3.small | -$25/mo | Less CPU/RAM headroom |
| Self-managed MongoDB on EC2 t3.small | -$45/mo | Manual ops, patching, backups |
| MongoDB Atlas M10 | -$30/mo | Egress charges may apply |

### 2. NAT Gateway — $35–97/mo
The most surprising cost for new AWS users. Data processing fees add up fast.

| Option | Saving | Trade-off |
|---|---|---|
| Single NAT (`single_nat_gateway = true`) | -$62/mo | Single AZ dependency |
| VPC Endpoints for ECR/S3/Secrets Manager | -$10–20/mo | Eliminates NAT data charges for these services |
| Reduce image sizes (smaller Docker pulls) | Variable | Engineering effort |

### 3. ALB — $16–30/mo
Base charge is fixed. LCU charges scale with traffic.

| Option | Saving | Trade-off |
|---|---|---|
| Remove staging ALB when not in use | -$16/mo | Staging teardown required |
| Use CloudFront caching aggressively | Variable | Fewer requests hit ALB |

### 4. Fargate Spot — saves 70% on compute
Switch non-critical workloads (frontend especially) to Spot instances.
Backend on Spot is riskier — 2-minute interruption notice with no graceful drain guarantee.

### 5. CloudWatch Logs — control log volume
Each ECS task writes logs. At scale, log ingestion costs add up.

```hcl
# In modules/ecs/main.tf — reduce retention to 7 days in staging
retention_in_days = 7   # was 30
```

---

## Monthly Budget Alert Setup

The Terraform `observability.tf` creates a budget alert automatically:

```hcl
resource "aws_budgets_budget" "monthly" {
  name         = "${var.app_name}-${var.environment}-monthly"
  budget_type  = "COST"
  limit_amount = "300"   # alert at $300 — adjust to your comfort level
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
}
```

Alerts fire at:
- **80%** of budget → informational warning
- **100%** of budget → action required notification

Adjust `limit_amount` in `variables.tf` or your `terraform.tfvars`.

---

## Cost Optimisation Checklist

### Immediate (zero trade-off)
- [ ] Set `single_nat_gateway = true` (saves $62/mo, minor HA loss)
- [ ] Set CloudWatch log retention to 14 days in staging (saves ~$2/mo)
- [ ] Enable ECR lifecycle rules (already in Terraform — deletes untagged images after 1 day)
- [ ] Use Fargate Spot for the frontend service (saves ~$5/mo, no impact)
- [ ] Set up monthly budget alert at $300 to catch runaway costs

### Short-term (small trade-off)
- [ ] Remove DocumentDB replica in staging (`instance_count = 1`, saves $60/mo on staging)
- [ ] Destroy staging on weekends (`terraform destroy`, saves ~$50/mo)
- [ ] Add VPC endpoints for ECR, S3, Secrets Manager (removes NAT data charges for these, saves ~$10/mo)
- [ ] Compress CloudFront responses (already enabled in Terraform — verify `compress = true`)

### Medium-term (engineering investment)
- [ ] Migrate to self-managed MongoDB on EC2 t3.medium (saves ~$60/mo, requires ops)
- [ ] Implement Redis connection pooling to reduce ElastiCache connections
- [ ] Set up CloudFront cache invalidation strategy to maximise cache hit rate
- [ ] Move background jobs (e.g. email sending) to Lambda + SQS (cheaper than always-on Fargate)

---

## AWS Billing Tools

```bash
# Check current month spend
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --query 'ResultsByTime[0].Total.UnblendedCost'

# Break down by service
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[*].[Keys[0],Metrics.UnblendedCost.Amount]' \
  --output table

# Check NAT Gateway data transfer (the hidden cost)
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics "UsageQuantity" \
  --filter '{"Dimensions":{"Key":"SERVICE","Values":["Amazon Virtual Private Cloud"]}}' \
  --query 'ResultsByTime[0].Total.UsageQuantity'
```

---

## Pricing References

- ECS Fargate: https://aws.amazon.com/fargate/pricing/
- DocumentDB: https://aws.amazon.com/documentdb/pricing/
- ElastiCache: https://aws.amazon.com/elasticache/pricing/
- NAT Gateway: https://aws.amazon.com/vpc/pricing/
- CloudFront: https://aws.amazon.com/cloudfront/pricing/
- ALB: https://aws.amazon.com/elasticloadbalancing/pricing/
- WAF: https://aws.amazon.com/waf/pricing/
- AWS Pricing Calculator: https://calculator.aws/

