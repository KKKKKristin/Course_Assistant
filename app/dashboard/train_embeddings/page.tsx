'use client'

import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, Modal, Checkbox, Typography, Form, Input, Select, message, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

const { Title } = Typography;

interface Item {
  CreatedTime: string;
  Embedding: string;
  ID: string;
  OriginalText: string;
  UploadSource: string;
}

interface Course {
  id: string;
  name: string;
}

interface FormValues {
  email: string;
  password: string;
  user_type: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState({ ID: '', CreatedTime: '', OriginalText: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 每页显示5个项目
  const [totalItems, setTotalItems] = useState(0); // 总项目数
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [cid, setCid] = useState('');
  const [email, setEmail] = useState('');
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  // const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();

  //--------------display user's courses---------
  const fetchUserCourses = async () => {
    if (email) {
      try {
        const response = await fetch(`http://lax.nonev.win:5500/users/${encodeURIComponent(email)}/courses/all`);
        const data = await response.json();
        setUserCourses(data); // Assuming the data is an array of courses
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
        message.error('Failed to fetch courses');
        setUserCourses([]);
      }
    }
  };

  const handleFindCourses = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetchUserCourses();
  };

  //--------------upload piazza--------------------

  let embeddingAbortController = new AbortController();

  // const handleAddItem = () => {
  //   setIsModalVisible(true);
  // };


  const handleSubmitForm = async (values:FormValues) => {
    console.log("waiting to process...");
    const hide = message.loading('Please wait a moment for processing...', 0);
    embeddingAbortController = new AbortController();
    try {
      const requestBody = {

        "email": values.email,
        "password": values.password,
        "user_type": values.user_type
      };

      const response = await fetch(`http://lax.nonev.win:5505/start/${cid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: embeddingAbortController.signal,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

     

      // Handle success response
      const data = await response.json();
      console.log(data);
      console.log(data.message);
      message.success(data.message + " and activate Piazza automatic answer");
      setIsModalVisible(false);
      form.resetFields(); // Reset form after successful submission

    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log('process aborted by the user');
            message.error('Process canceled.');
          } else {
            console.error('There was an error for uploading the data to embedding:', error);
            message.error('Failed to upload piazza data.');
          }
    }
    hide();
  };

  //------------get course list and select course-----

  // const handleSelectCourse = async () => {
  //   const email = form.getFieldValue('email');
  //   console.log("email: " + email)
  //   try {
  //     const response = await fetch(`http://lax.nonev.win:5500/users/${email}/courses/all`);
  //     if (!response.ok) throw new Error('Failed to fetch courses');
  //     const coursesList = await response.json();
  //     setCourses(coursesList); // Assuming the API returns an array of courses
  //     // Find the course ID by course name
  //     const course = coursesList.find(course => course.name === courseName);
  //     if (course) {
  //       setCid(course.id); // Assuming each course object has an 'id' field
  //       message.success("course select successfully");
  //   } else {
  //       message.error('Course not found');
  //     }
  //   //   const data = await response.json();
  //   } catch (error) {
  //     console.error('Fetching courses failed:', error);
  //     message.error('Failed to fetch courses');
  //   }

  // };
  

  //-------------upload video--------------

  let abortController = new AbortController();

  // const beforeUpload = (file) => {
  //   // Update the file list state to include the new file
  //   setFileList([file]);
  //   // Return false to stop automatic upload
  //   return false;
  // };

  const beforeUpload = (file: RcFile): boolean => {
    const fileForUpload: UploadFile = {
        uid: file.uid, // 确保每个文件有唯一的 ID
        name: file.name,
        status: 'done', // 或其他状态，如 'uploading', 'removed'
        type: file.type,
        size: file.size,
        originFileObj: file, // 原始 File 对象
    };

    setFileList([fileForUpload]);
    return false;
};

  
// const handleUpload = async () => {
//   // const { courseName } = formValues;
//   if (fileList.length > 0) {
//     console.log("Uploading files...");
//     // Re-initialize the abort controller for a new set of requests
//     abortController = new AbortController();

//     // Display a loading message
//     const hide = message.loading('Please wait a moment for video uploading...', 0);
  
//     let uploadFailed = false;
//     let uploadAborted = false;

//     for (const file of fileList) {
//       const formData = new FormData();
//       formData.append('courseID', courseName.replace(/\s+/g, '') );

//         // formData.append('courseID', "EE450");
//       formData.append('video', file);
  
//       try {
//         // Step 2: Include the abort signal in the fetch request
//         const response = await fetch('http://lax.nonev.win:5000/upload-rawVideo', {
//           method: 'POST',
//           body: formData,
//           signal: abortController.signal, // Include the abort signal
//         });
  
//         if (!response.ok) {
//           throw new Error(`Network response was not ok for ${file.name}.`);
//         }
  
//         const data = await response.json();
//         console.log(`${file.name} uploaded successfully:`, data);
//       } catch (error) {
//         if ((error as Error).name === 'AbortError') {
//           console.log('Upload aborted by the user:', file.name);
//           message.error('Upload canceled.');
//           uploadAborted = true;
//           break; // Exit the loop if the upload was aborted
//         } else {
//           console.error('There was an error uploading a file:', error);
//           uploadFailed = true;
//         }
//       }
//     }
  
//     hide(); // Hide the loading message regardless of outcome
  
//     if (!uploadFailed && !uploadAborted) {
//       message.success('All files uploaded successfully.');
//       setFileList([]); // Clear the file list after successful upload
//     }
//     setIsUploadModalVisible(false); // Close the modal
//   } else {
//     console.error("No file selected");
//     message.error("No file selected.");
//   }
// };

const handleUpload = async () => {

  if (fileList.length > 0) {
    console.log("Uploading files...");
    // Re-initialize the abort controller for a new set of requests
    abortController = new AbortController();

    // Display a loading message
    const hide = message.loading('Please wait a moment for video uploading...', 0);

    let uploadFailed = false;
    let uploadAborted = false;

    for (const file of fileList) {
      if (file.originFileObj) {
        const formData = new FormData();
        formData.append('courseID', courseName.replace(/\s+/g, ''));

        // 确保使用 file.originFileObj，它是 Blob 类型
        formData.append('video', file.originFileObj, file.name);

        try {
          const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/upload-rawVideo', {
            method: 'POST',
            body: formData,
            signal: abortController.signal,
          });

          if (!response.ok) {
            throw new Error(`Network response was not ok for ${file.name}.`);
          }

          const data = await response.json();
          console.log(`${file.name} uploaded successfully:`, data);
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            console.log('Upload aborted by the user:', file.name);
            message.error('Upload canceled.');
            uploadAborted = true;
            break; // Exit the loop if the upload was aborted
          } else {
            console.error('There was an error uploading a file:', error);
            uploadFailed = true;
          }
        }
      } else {
        console.error('No file object available:', file);
        uploadFailed = true;
      }
    }

    hide(); // Hide the loading message regardless of outcome

    if (!uploadFailed && !uploadAborted) {
      message.success('All files uploaded successfully.');
      setFileList([]); // Clear the file list after successful upload
    }
  } else {
    console.error("No file selected");
    message.error("No file selected.");
  }
};

  
const handleOpenModal = () => {
  form.resetFields(); // 重置表单字段
  // setCourseName('');  // 重置课程名称
  // setCid('');         // 重置课程ID
  // setIsModalVisible(true);
}; 

  return (
    <div>
      <Title level={2}>Train Embeddings</Title>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<PlusOutlined />} onClick={() => {setIsModalVisible(true); form.resetFields(); setUserCourses([]);}}>Piazza upload & automatic reply</Button>
        <Button icon={<UploadOutlined />} onClick={() => {setIsUploadModalVisible(true); form.resetFields(); setUserCourses([]); setFileList([]);}} style={{ marginLeft: 8 }}>Upload Video</Button>
      </div>
  
      {/* Modal component for train embedding for a course */}
      <Modal title="Add Item" 
        open={isModalVisible} 
        onCancel={() => {
          setIsModalVisible(false); 
          // embeddingAbortController.abort();
        }} 
        // onOk={() => form.submit()}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsModalVisible(false);
              embeddingAbortController.abort();  // 中止操作
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            style={{
              color: 'black',
              borderColor:'gray'
            }}
            onClick={() => form.submit()}  
          >
            Upload
          </Button>
        ]}
        >
        <Form form={form} onFinish={handleSubmitForm}>
          <Form.Item name="email" label="Piazza Email" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }} onChange={e => setEmail(e.target.value)}/>
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password style={{ borderRadius: '6px' }}/>
          </Form.Item>
          <Button type="primary" style={{ margin: '0px 10px', color: 'black', borderColor:'gray' }} onClick={handleFindCourses}>Find your courses</Button>
          <div className="course-selection" style={{ margin: '20px 15px' }}>
            {userCourses.map((course, index) => (
              <Button
                key={index}
                style={{ margin: '5px', backgroundColor: `hsl(${index * 360 / userCourses.length}, 100%, 100%)` }}
                onClick={() => {setCid(course.id); setCourseName(course.name); message.success(`course: ${course.name} courseId: ${course.id} set successfully!`);}}
              >
                {course.name}
              </Button>
            ))}
          </div>
          {/* <Form.Item name="user_type" label="User Type (instructor input i, otherwise input s)" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }}/>
          </Form.Item> */}
          <Form.Item name="user_type" label="User Type" rules={[{ required: true, message: 'Please select user type!' }]}>
            <Select placeholder="Select user type" style={{ width: 200 }}>
              <Select.Option value="i">Instructor</Select.Option>
              <Select.Option value="s">Student</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    {/* Modal component for video upload */}
      <Modal
        title="Upload File"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          // setFileList([]);
          // abortController.abort(); // Abort the upload process
        }}
        footer={[
          <Button key="back" onClick={() => {
            setIsUploadModalVisible(false);
            setFileList([]);
            abortController.abort(); // Abort the upload process
          }}>
            Cancel
          </Button>,
          <Button form="uploadForm" key="submit" htmlType="submit" type="primary"   
            style={{
              color: 'black',
              borderColor:'gray'
            }}
          >
            Upload
          </Button>,
        ]}
      >
        {/* <Form
          id="uploadForm"
          onFinish={handleUpload}
        >
          <section>
            <header className="mb-5 text-left">
              <h3 className="text-lg text-blue-600">Find Your Courses</h3>
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
                    <Button onClick={handleFindCourses} style={{ display: 'inline-flex', width: 'auto' }}>Find your courses</Button>

                </form>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {userCourses.map((course, index) => (
                <button
                  key={index}
                  onClick={() => setCourseName(course.name)}  // Set the course name to state when a course button is clicked
                  className="p-1 border border-gray-300 rounded-lg shadow-sm text-xs"
                  style={{ backgroundColor: `hsl(${index * 360 / userCourses.length}, 70%, 80%)` }}
                >
                  {course.name}
                </button>
              ))}
            </div>
          </section>
          <Form.Item>
            <Upload
              beforeUpload={beforeUpload}
              multiple={false}
              fileList={fileList}
              onRemove={() => setFileList([])} // Allow removing the file, clearing the state
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form> */}
        <Form form={form} id="uploadForm" onFinish={handleUpload}>
          <Form.Item
            label="Find your courses"
            name="piazza_email"
            rules={[{ required: true, message: 'Please input your Piazza email!' }]}
          >
            <Input style={{ borderRadius: '6px' }} placeholder="Enter your Piazza email" onChange={e => setEmail(e.target.value)} />
          </Form.Item>
          <Button type="primary" style={{ margin: '0px 10px', color: 'black', borderColor:'gray' }} onClick={handleFindCourses}>Find your courses</Button>

          <div className="course-selection" style={{ margin: '20px 15px' }}>
            {userCourses.map((course, index) => (
              <Button
                key={index}
                style={{ margin: '5px', backgroundColor: `hsl(${index * 360 / userCourses.length}, 100%, 100%)` }}
                onClick={() => {setCourseName(course.name); message.success(`course: ${course.name} set successfully!`);}}
              >
                {course.name}
              </Button>
            ))}
          </div>

          {/* <Form.Item
            label="Selected Course"
            name="courseName"
            rules={[{ required: true, message: 'Please select a course!' }]}
          >
            <Input readOnly />
          </Form.Item> */}

          <Form.Item label="Upload Video">
            <Upload
              beforeUpload={beforeUpload}
              fileList={fileList}
              onRemove={() => setFileList([])}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}



