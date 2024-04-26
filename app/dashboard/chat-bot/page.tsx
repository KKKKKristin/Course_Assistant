'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
// import { useRouter } from 'next/router';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Course {
  id: string;
  name: string;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [email, setEmail] = useState('');
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  // const [showForm, setShowForm] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();


  const fetchCourses = async () => {
    try {
      
      // const response = await fetch('http://lax.nonev.win:5000/list-tables?region-name=us-west-1');
      const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/list-tables?region-name=us-west-1');

      const data = await response.json();
      if (data.Tables && Array.isArray(data.Tables)) {
        setCourses(data.Tables);
      } else {
        console.error('Unexpected data structure:', data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  const fetchUserCourses = async () => {
    if (email) {
      try {
        const response = await fetch(`http://lax.nonev.win:5500/users/${encodeURIComponent(email)}/courses/all`);
        const data = await response.json();
        setUserCourses(data); // Assuming the data is an array of courses
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
        setUserCourses([]);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const handleFindCourses = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchUserCourses();
  };

 
  const handleCourseClick = (courseId:string, courseName:string) => {
    // if (routerReady) {
      console.log("course id:"+ courseId+ "course name: "+courseName)
      // router.push(`/dashboard/chat-bot/course?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`, { scroll: false });
      router.push(`/dashboard/chat-bot/course?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
    // }
  };

  return (
    <div>
      <Head>
        <title>Courses Database</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* <div className="flex flex-col bg-white-100 min-h-screen"> */}
        {/* <div className="p-5 bg-white shadow-md flex-grow overflow-auto"> */}
          <header className="mb-5 text-left">
            <h1 className="text-xl text-blue-600">Courses Accessible in Database</h1>
          </header>
          <main>
            <section className="grid grid-cols-3 gap-3 mb-5">
              {courses.map((course, index) => (
                <div key={index} className="bg-white p-1 border border-gray-300 rounded-lg shadow-sm text-sm">
                  {course.toString()}
                </div>
              ))}
            </section>
            <section>
              <header className="mb-5 text-left">
                <h2 className="text-lg text-blue-600">Find Your Courses</h2>
              </header>
              <div className="text-left">
                  <form onSubmit={handleFindCourses} className="mt-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Piazza email"
                      className="text-black p-1 border border-gray-300 rounded text-sm"
                      required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700 ml-2 text-sm">
                      Submit
                    </button>
                  </form>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5" style={{margin: '20px 15px'}}>
                {userCourses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourseClick(course.id, course.name)}
                    className="p-1 border border-gray-300 rounded-lg shadow-sm text-xs"
                    style={{ backgroundColor: `hsl(${index * 360 / userCourses.length}, 100%, 100%)` }}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            </section>
          </main>
        {/* </div> */}
        {/* <footer className="text-center mt-auto p-5">
          <p>Contact us at <a href="mailto:support@yourdomain.com" className="text-blue-600 hover:text-blue-800">support@yourdomain.com</a></p>
        </footer> */}
      {/* </div> */}
    </div>
  );
};

export default Page;

