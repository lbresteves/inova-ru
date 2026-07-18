export type ConsumerSituation = "active" | "inactive" | "blocked";

export type ConsumerCategory = {
  code: string;
  description: string;
};

export type CostCenter = {
  type: string;
  description: string;
};

export type Consumer = {
  name: string;
  category: ConsumerCategory;
  costCenter: CostCenter;
  situation: ConsumerSituation;
  rawSituation: "A" | "I" | "B";
};

export type Balance = {
  current: number;
  maxRechargeAmount: number;
};

export type CreditAccount = {
  consumer: Consumer;
  balance: Balance;
  permissions: {
    canConsume: boolean;
    canRecharge: boolean;
  };
};
