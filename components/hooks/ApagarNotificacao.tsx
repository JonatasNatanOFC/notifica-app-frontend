import AsyncStorage from '@react-native-async-storage/async-storage';

import { INotificacao } from '@/interfaces/INotificacao';

export default async function ApagarNotificacao(id: number, notificacoes: INotificacao[], asyncKey: string) {
    const novaLista = notificacoes.filter((not) => Number(not.id) !== id);
    await AsyncStorage.setItem(asyncKey, JSON.stringify(novaLista.reverse()));
    return novaLista;
}