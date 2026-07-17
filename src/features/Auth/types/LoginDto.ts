export type LoginRequestDto = {
  user: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  usuario: {
    nome: string;
    email: string;
    isAluno: number;
    isColaborador: number;
  };
};
