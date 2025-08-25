import { ILocalizacao } from "./ILocalizacao";

export interface INotificacao {
  id: string;
  userId: string;
  descricao: string;
  fotoUrl: string;
  localizacao: ILocalizacao;
  dataEnvio: string;
  status: 'pendente' | 'resolvido' | 'análise';
  respostaPrefeitura?: string;
}

// import { ILocalizacao } from "./ILocalizacao";

// export interface INotificacao {
//   id: string;
//   userId: string;
//   descricao: string;
//   fotoUrl: string;
//   localizacao: ILocalizacao;
//   dataEnvio: string;
//   status: string;
//   respostaPrefeituraId?: number | null;
// }