import type { AuthSession } from "../types/AuthSession";
import type { LoginResponseDto } from "../types/LoginDto";

export function mapLoginResponse(dto: LoginResponseDto): AuthSession {
  return {
    token: dto.token,
    user: {
      email: dto.usuario.email,
      isEmployee: dto.usuario.isColaborador === 1,
      isStudent: dto.usuario.isAluno === 1,
      name: dto.usuario.nome,
    },
  };
}
