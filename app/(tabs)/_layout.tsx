// import React from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import { Pressable } from 'react-native';
// import Drawer from 'expo-router/drawer';

// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Drawer
//       screenOptions={{
//       headerTintColor: '#333',
//       drawerActiveTintColor: '#007bff',
//       drawerLabelStyle: {
//         marginLeft: 20,
//       },
//     }}>
//       {/* <Drawer.Screen
//         name="notificacao"
//         options={{
//           title: 'Noticação',
//           drawerIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       /> */}
//       {/* <Drawer.Screen
//         name="minhasNotificacoes"
//         options={{
//           title: 'Minhas notificações',
//           drawerIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       /> */}
//       {/* <Drawer.Screen
//         name="notificacaoPrefeitura"
//         options={{
//           title: 'Notificações Prefeitura',
//           drawerIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       /> */}
//     </Drawer>
//   );
// }
