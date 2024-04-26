'use client';
// import { useRouter } from 'next/router';
import {useRouter} from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // 使用 UUID 生成库

function NewChatButton() {
  const router = useRouter();

  const handleNewChat = () => {
    const newSessionId = uuidv4(); // 生成一个新的 UUID 作为 sessionId
    router.push(`/app/dashboard/${newSessionId}`); // 导航到新的会话页面
  };

  return (
    <button onClick={handleNewChat}>New Chat</button>
  );
}

export default NewChatButton;
