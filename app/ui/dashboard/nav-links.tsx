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

