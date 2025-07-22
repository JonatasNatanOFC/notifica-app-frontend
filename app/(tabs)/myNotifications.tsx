import { useState, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Text } from '@/components/Themed'
import NotificationCard from '@/components/NotificationCard'

import { INotification } from '@/interfaces/INotification'


export default function MyNotifications() {
  const [notifications, setNotifications] = useState<INotification[]>([])

  useEffect(() => {
    async function loadData() {
      const newNoT1: INotification = {
        'location': 'Rua Cloverfield',
        'createdAt': '21/07/2025 às 12:57',
        'image': 'https://blog.pneubest.com.br/wp-content/uploads/2018/04/ThinkstockPhotos-655985038-2.jpg',
        'description': 'Buraco na rua',
        'user': 'Buster',
        'status': 'Pendente'
      }
      const newNoT2: INotification = {
        'location': 'Rua Cloverfield',
        'createdAt': '21/07/2025 às 12:57',
        'image': 'https://blog.pneubest.com.br/wp-content/uploads/2018/04/ThinkstockPhotos-655985038-2.jpg',
        'description': 'Buraco na rua',
        'user': 'Buster',
        'status': 'Resolvido'
      }
      setNotifications([newNoT1,newNoT2,newNoT2,newNoT1])
    }
      loadData()
  },[])

  return (
    <ScrollView>
      {notifications.length > 0 ? notifications.map(not => (
        <NotificationCard
          key={notifications.indexOf(not)}
          location={not.location}
          createdAt={not.createdAt}
          image={not.image}
          description={not.description}
          user={not.user}
          status={not.status}
        />
      ))
      : <Text style={styles.noNots}>Nenhuma notificação</Text> }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  noNots: {
    paddingVertical: 30,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold'
  },
})
