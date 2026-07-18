export const creditAccountKeys = {
  all: ["credit-account"] as const,
  account: (cpf: string | null | undefined) =>
    [...creditAccountKeys.all, cpf ?? "anonymous", "account"] as const,
};
