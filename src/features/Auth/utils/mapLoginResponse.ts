import {
  assertRecord,
  createContractError,
  readInteger,
  readString,
} from "@shared/api";
import type { AuthSession } from "../types/AuthSession";
import type { LoginResponseDto } from "../types/LoginDto";

function readFlag(
  record: Record<string, unknown>,
  key: string,
  path: string,
): boolean {
  const value = readInteger(record, key, path);
  if (value !== 0 && value !== 1) {
    throw createContractError(`Campo ${path} deve ser 0 ou 1.`, record);
  }
  return value === 1;
}

export function mapLoginResponse(
  dto: LoginResponseDto,
  subjectCpf: string,
): AuthSession {
  const root = assertRecord(dto, "login");
  const usuario = assertRecord(root.usuario, "usuario");

  return {
    schemaVersion: 1,
    subjectCpf,
    token: readString(root, "token"),
    user: {
      email: readString(usuario, "email", "usuario.email"),
      isEmployee: readFlag(
        usuario,
        "isColaborador",
        "usuario.isColaborador",
      ),
      isStudent: readFlag(usuario, "isAluno", "usuario.isAluno"),
      name: readString(usuario, "nome", "usuario.nome"),
    },
  };
}
