import { ILocalizacao } from "./ILocalizacao";

export interface INotificacao {
  id: string;
  userId: string;
  descricao: string;
  fotoUrl: string;
  localizacao: ILocalizacao;
  dataEnvio: string;
  status: 'pendente' | 'resolvido';
  respostaPrefeitura?: string;
}
