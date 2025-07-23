export interface IUsuario {
  id: string; // Ex: "abc123" ou Date.now().toString()
  email?: string;
  senha?: string;
  tipo: 'cidadao' | 'prefeitura';
  cidade?: string;
}
