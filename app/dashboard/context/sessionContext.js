// // contexts/SessionContext.js
// import React, { createContext, useContext, useState } from 'react';
// import {ChatSessionPage} from '@/app/dashboard/[sessionId]/page';

// const session = (
//   // {
//   // id: string,
//   // createdAt: Date,
//   // }
// );

// const SessionContext = createContext(
//     {
//         sessions: [], 
//         addSession: () => {},
//       }
// );

// export const useSessions = () => useContext(SessionContext);

// export const SessionProvider = ({ children }) => {
//   const [sessions, setSessions] = useState([]);

//   添加会话
//   const addSession = (session) => {
//     setSessions((prevSessions) => [...prevSessions, session]);
//   };
//   // const addSession = (session) => {
//   //   setSessions([...sessions, session]);
//   // };

//   return (
//     <SessionContext.Provider value={{ sessions, addSession }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };

// //============tsx============

// //contexts/SessionContext.tsx
// // import React, { createContext, useContext, useState, ReactNode } from 'react';
// // import MyApp from '@/app/dashboard/_app';
// // interface Session {
// //   // 定义会话的属性，例如：
// //   id: string;
// //   createdAt: Date;
// // }

// // interface SessionContextType {
// //   sessions: Session[];
// //   addSession: (session: Session) => void;
// // }

// // // 创建上下文时提供初始值的类型
// // const SessionContext = createContext<SessionContextType | undefined>(undefined);

// // interface SessionProviderProps {
// //   children: ReactNode; // ReactNode 是 React 子元素的类型
// // }

// // export const useSessions = () => {
// //   const context = useContext(SessionContext);
// //   if (context === undefined) {
// //     throw new Error('useSessions must be used within a SessionProvider');
// //   }
// //   return context;
// // };

// // export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
// //   const [sessions, setSessions] = useState<Session[]>([]);

// //   const addSession = (session: Session) => {
// //     setSessions((prevSessions) => [...prevSessions, session]);
// //   };

// //   return (
// //     <SessionContext.Provider value={{ sessions, addSession }}>
// //       {children}
// //     </SessionContext.Provider>
// //   );
// // };

// //============tsx2====

// // import React, { createContext, useContext, useState, ReactNode } from 'react';
// // import MyApp from '@/app/dashboard/_app';
// // interface Session {
// //   id: string;
// //   createdAt: Date;
// // }

// // interface SessionContextType {
// //   sessions: Session[];
// //   addSession: (session: Session) => void;
// // }

// // const SessionContext = createContext<SessionContextType>({
// //   sessions: [],
// //   addSession: () => {},
// // });

// // export const useSessions = () => useContext(SessionContext);

// // export const SessionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
// //   const [sessions, setSessions] = useState<Session[]>([]);

// //   const addSession = (session: Session) => {
// //     setSessions((prevSessions) => [...prevSessions, session]);
// //   };

// //   return (
// //     <SessionContext.Provider value={{ sessions, addSession }}>
// //       {children}
// //     </SessionContext.Provider>
// //   );
// // };
