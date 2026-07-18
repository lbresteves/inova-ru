from __future__ import annotations

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    user: str = Field(min_length=11, max_length=11, pattern=r"^\d{11}$")
    password: str = Field(min_length=1)
