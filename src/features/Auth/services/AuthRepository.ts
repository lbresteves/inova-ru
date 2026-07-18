import type { IHttpClient } from "@shared/types/IHttpClient";
import type { AuthSession } from "../types/AuthSession";
import type { LoginRequestDto, LoginResponseDto } from "../types/LoginDto";
import type { LoginForm } from "../types/LoginForm";
import { mapLoginResponse } from "../utils/mapLoginResponse";

export class AuthRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async login(form: LoginForm): Promise<AuthSession> {
    const user = form.institutionalId.trim();
    const response = await this.httpClient.post<
      LoginRequestDto,
      LoginResponseDto
    >("/usuarios/login", {
      password: form.password,
      user,
    });

    return mapLoginResponse(response, user);
  }
}
