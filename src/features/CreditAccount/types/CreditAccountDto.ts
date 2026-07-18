export type CreditAccountResponseDto = {
  consumidor: {
    nome: string;
    tipo_consumidor: {
      codigo: string;
      descricao: string;
    };
    centro_custo: {
      tipo: string;
      descricao: string;
    };
    situacao: string;
  };
  saldo: {
    credito_disponivel: number;
    limite_recarga: number;
  };
};
