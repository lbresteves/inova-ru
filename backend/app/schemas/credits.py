from __future__ import annotations

from decimal import Decimal
from pydantic import BaseModel, Field


class CreatePaymentRequest(BaseModel):
    valor: Decimal = Field(gt=Decimal("0"))
