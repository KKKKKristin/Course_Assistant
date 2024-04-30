'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Layout, Row, Col, Form, Input, Button } from 'antd';
// import { useRouter } from 'next/router';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import {ChatSessionPage} from '@/app/dashboard/[sessionId]';
// import { useSessions, SessionProvider} from '@/app/dashboard/context/sessionContext';

const { Header, Content, Footer } = Layout;


const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams()
  // useEffect(() => {
  //   if (router.isReady) {  // 确保router对象已准备好
  //     const { courseId, courseName } = router.query;
  //     setCourseId(courseId);
  //     setCourseName(decodeURIComponent(courseName));
  //     console.log("course id and name is ready....:"+ courseName);
  //   }
  //   console.log("course id and name is ready....:"+ courseName);
  // }, [router.isReady, router.query]);

  // const route = router.query;

  useEffect(() => {
    const courseId = searchParams.get('courseId') || '';
    var courseName = searchParams.get('courseName') || '';
    courseName = courseName.replace(/\s+/g, '');
    setCourseId(courseId);
    setCourseName(decodeURIComponent(courseName));
    console.log("Set static values for course ID and Name." + courseName + courseId );
  }, []);


  // useEffect(() => {
  //   console.log("Router is ready:", router.isReady);
  //   console.log("Router query:", router.query);
  
  //   if (router.isReady) {
  //     const { courseId, courseName } = router.query;
  //     console.log("Extracted courseId:", courseId);
  //     console.log("Extracted courseName:", courseName);
  
  //     if (typeof courseId === 'string') {
  //       setCourseId(courseId);
  //     }
  
  //     if (typeof courseName === 'string') {
  //       setCourseName(decodeURIComponent(courseName));
  //     }
  
  //     console.log("Set course ID and name:", courseId, courseName);
  //   }
  // }, [router.isReady, router.query]);
  

  const sendMessage = async () => {
    if (!input.trim()) return;

    // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/ask', {

    const response = await fetch('http://lax.nonev.win:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ question: input, courseID: courseName }),
      // body: JSON.stringify({ question: input, courseID: courseName }),
      body: JSON.stringify({ question: input, courseID: courseName}),


    });

    const data = await response.json();
    console.log(data);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}\n`, `Bot: ${data.answer}`]);
    setInput('');
  };

  
  return (
    <div>
      <Head>
        <title>CourseAssistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* <div className="flex flex-col min-h-screen bg-white-100" style={{ minHeight: '100vh' }}> */}
        {/* <div className="w-full max-w-4xl p-5 bg-white shadow-md rounded-lg" style={{ minHeight: '100vh'}}> */}
          <header className="text-center">
            <h1 className="text-3xl text-blue-600">Welcome to CourseAssistant</h1>
            <p className="text-xl text-gray-600">{courseName} Teaching Assistant</p>
          </header>
          <main>
            <section className="chatbot mt-5">
              <div className="bg-white border-2 border-blue-600 rounded-lg p-5">
                <div className="flex flex-col bg-white-100 h-48 overflow-y-auto mb-5 p-2.5 bg-gray-200 border border-gray-300 rounded-lg" style={{ minHeight: '50vh' }}>
                  {messages.map((msg, index) => (
                    <p key={index} className="message">{msg}</p>
                  ))}
                </div>
                <textarea
                  className="w-full mb-2 p-2.5 border border-gray-300 rounded-lg"
                  placeholder={`Type your question of ${decodeURIComponent(courseName)}`}
                  // placeholder="Type your question of" + "${decodeURIComponent(courseName)}"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <button className="w-full bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-700" onClick={sendMessage}>Send</button>
              </div>
            </section>
          </main>
          <footer className="text-center mt-5">
            <p>Contact us at <a href="mailto:support@eta.com" className="text-blue-600 hover:text-blue-800">support@eta.com</a></p>
          </footer>
        {/* </div> */}
      {/* </div> */}
    </div>
  );

  // return (
  //   <>
  //     <Head>
  //       <title>Courses Database</title>
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //     </Head>
  //     <Layout className="layout" style={{ minHeight: '100vh' }}>
  //       <Header style={{ background: '#fff', padding: 0 }}>
  //         <div className="header-content" style={{ padding: 16 }}>
  //           <h1 className="text-xl text-blue-600">Courses Accessible in Database</h1>
  //         </div>
  //       </Header>
  //       <Content style={{ padding: '0 50px', marginTop: 64 }}>
  //         <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
  //           <Row gutter={[16, 16]}>
  //             {courses.map((course, index) => (
  //               <Col key={index} span={8}>
  //                 <div className="course-card" style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
  //                   {course}
  //                 </div>
  //               </Col>
  //             ))}
  //           </Row>
  //           <Form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
  //             <Form.Item label="Piazza Email">
  //               <Input
  //                 type="email"
  //                 value={email}
  //                 onChange={(e) => setEmail(e.target.value)}
  //                 placeholder="Enter your Piazza email"
  //                 required
  //               />
  //             </Form.Item>
  //             <Button type="primary" htmlType="submit">
  //               Submit
  //             </Button>
  //           </Form>
  //         </div>
  //       </Content>
  //       <Footer style={{ textAlign: 'center' }}>
  //         Contact us at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>
  //       </Footer>
  //     </Layout>
  //   </>
  // );
};

export default Page;
