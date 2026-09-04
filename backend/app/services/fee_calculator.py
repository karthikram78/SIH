from app.config import settings
from app.schemas import PaymentBreakdown

def calculate_payment_split(total_amount: float) -> PaymentBreakdown:
    """
    Calculates statutory Section 14 platform fee distribution:
    - Worker earnings: 85%
    - Cooperative welfare fund: 10%
    - Platform operations & technology fee: 5%
    """
    worker_pct = settings.WORKER_SHARE_PERCENT
    coop_pct = settings.COOPERATIVE_SHARE_PERCENT
    platform_pct = settings.PLATFORM_SHARE_PERCENT

    worker_earnings = round((total_amount * worker_pct) / 100.0, 2)
    cooperative_contribution = round((total_amount * coop_pct) / 100.0, 2)
    platform_fee = round(total_amount - worker_earnings - cooperative_contribution, 2)

    return PaymentBreakdown(
        totalAmount=total_amount,
        workerEarnings=worker_earnings,
        cooperativeContribution=cooperative_contribution,
        platformFee=platform_fee,
        workerPercentage=worker_pct,
        cooperativePercentage=coop_pct,
        platformPercentage=platform_pct
    )
