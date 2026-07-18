import { assertRecord, readNumber, readString } from "@shared/api";
import type { AuthSession } from "../types/AuthSession";
import type { LoginResponseDto } from "../types/LoginDto";
import { readJwtExpiration, readJwtSubject } from "./jwt";

export function mapLoginResponse(
  dto: LoginResponseDto,
  subjectCpf: string,
): AuthSession {
  const root = assertRecord(dto, "login");
  const token = readString(root, "token");
  const usuario = assertRecord(root.usuario, "usuario");

  return {
    expiresAt: readJwtExpiration(token),
    subjectCpf: readJwtSubject(token) ?? subjectCpf,
    token,
    user: {
      email: readString(usuario, "email", "usuario.email"),
      isEmployee: readNumber(usuario, "isColaborador", "usuario.isColaborador") === 1,
      isStudent: readNumber(usuario, "isAluno", "usuario.isAluno") === 1,
      name: readString(usuario, "nome", "usuario.nome"),
    },
  };
}
