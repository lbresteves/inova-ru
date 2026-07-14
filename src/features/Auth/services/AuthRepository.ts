import { httpClient } from "@shared/base";
import type { LoginForm } from "../types/LoginForm";
import type { LoginRequestDto, LoginResponseDto } from "../types/LoginDto";
import { mapLoginResponse } from "../utils/mapLoginResponse";

export const authRepository = {
  async login(form: LoginForm) {
    const request: LoginRequestDto = {
      password: form.password,
      user: form.cpf,
    };
    const response = await httpClient.post<LoginResponseDto>(
      "/usuarios/login",
      request,
    );
    return mapLoginResponse(response);
  },
};
