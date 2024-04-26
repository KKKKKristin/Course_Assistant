'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import {
  HomeOutlined,
  MessageOutlined,
  DatabaseOutlined,
  UploadOutlined
} from '@ant-design/icons';

// Define the links with associated icons for navigation
const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeOutlined
  },
  {
    name: 'Chat-bot',
    href: '/dashboard/chat-bot',
    icon: MessageOutlined
  },
  {
    name: 'Database',
    href: '/dashboard/database',
    icon: DatabaseOutlined
  },
  {
    name: 'Train Embeddings',
    href: '/dashboard/train_embeddings',
    icon: UploadOutlined
  }
];

const NavLinks = () => {
  return (
    <div>
      {links.map((link, index) => (
        <Link key={index} href={link.href} legacyBehavior>
          <a className="flex items-center justify-between w-full px-3 py-2 text-left text-black hover:bg-gray-200">
            <span className="flex items-center">
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </span>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;

//--------------------------
// import {
//   FolderIcon,
//   // DatabaseIcon,
// } from '@heroicons/react/24/outline'; // 确保这里的图标是正确导入的

// const links = [
//   {
//     name: 'Home',
//     href: '/dashboard',
//     icon: FolderIcon
//     // children: [
//     //   { name: 'Home', href: '/dashboard', icon: FolderIcon },
//     //   // { name: 'EE542', href: '/dashboard/chat-bot/ee542', icon: FolderIcon }
//     // ]
//   },
//   {
//     name: 'Chat-bot',
//     href: '/dashboard/chat-bot',
//     icon: FolderIcon,
//     // children: [
//     //   { name: 'EE450', href: '/dashboard/chat-bot/ee450', icon: FolderIcon },
//     //   { name: 'EE542', href: '/dashboard/chat-bot/ee542', icon: FolderIcon }
//     // ]
//   },
//   {
//     name: 'Database',
//     href: '/dashboard/database',
//     icon: FolderIcon,
//     // children: [
//     //   { name: 'EE450', href: '/dashboard/database/ee450', icon: FolderIcon },
//     //   { name: 'EE542', href: '/dashboard/database/ee542', icon: FolderIcon },
//     //   { name: 'Train Embeddings', href: '/dashboard/database/train_embeddings', icon: FolderIcon }
//     // ]
//   },
//   { 
//     name: 'Train Embeddings', 
//     href: '/dashboard/train_embeddings', 
//     icon: FolderIcon,
//   }
// ];

//-----------------------

// import {
//   HomeOutlined,
//   MessageOutlined,
//   DatabaseOutlined,
//   UploadOutlined
// } from '@ant-design/icons';

// const links = [
//   {
//     name: 'Home',
//     href: '/dashboard',
//     icon: HomeOutlined
//   },
//   {
//     name: 'Chat-bot',
//     href: '/dashboard/chat-bot',
//     icon: MessageOutlined
//   },
//   {
//     name: 'Database',
//     href: '/dashboard/database',
//     icon: DatabaseOutlined
//   },
//   { 
//     name: 'Train Embeddings', 
//     href: '/dashboard/train_embeddings', 
//     icon: UploadOutlined
//   }
// ];

// const NavLinks = () => {
//   const [expanded, setExpanded] = useState<number | null>(null);

//   return (
//     <div>
//       {links.map((link, index) => (
//         <div key={index}>
//           {!link.children ? (
//             // Direct link for items without children
//             <Link href={link.href} legacyBehavior>
//               <a className="flex items-center justify-between w-full px-3 py-2 text-left text-black hover:bg-gray-200">
//                 {/* <link.icon className="w-5 h-5 mr-3" />
//                 {link.name} */}
//                  <span className="flex items-center">
//                   <link.icon className="w-5 h-5 mr-3" />
//                   {link.name}
//                 </span>
//               </a>
//             </Link>
//           ) : (
//             // Button to manage expand/collapse for items with children
//             <>
//               <button
//                 onClick={() => setExpanded(expanded === index ? null : index)}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left text-black hover:bg-gray-200"
//                 aria-expanded={expanded === index}
//               >
//                 <span className="flex items-center">
//                   <link.icon className="w-5 h-5 mr-3" />
//                   {link.name}
//                 </span>
//                 <span>
//                   {expanded === index ? '-' : '+'}
//                 </span>
//               </button>
//               {expanded === index && link.children && (
//                 <div className="pl-8">
//                   {link.children.map((child, childIndex) => (
//                     <Link key={childIndex} href={child.href} legacyBehavior>
//                       <a className="block px-3 py-2 hover:bg-gray-100">{child.name}</a>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
// export default NavLinks;



