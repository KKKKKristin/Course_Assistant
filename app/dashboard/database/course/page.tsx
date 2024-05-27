'use client'

import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, Modal, Checkbox, Typography, Form, Input, message, Pagination} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

const { Title } = Typography;

interface Item {
  CreatedTime: string;
  Embedding: string;
  ID: string;
  OriginalText: string;
  UploadSource: string;
}

interface FormValues {
  couseId:string;
  CourseName:string;
  question: string;
  answer: string;
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
  const [form] = Form.useForm();
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams()
  // const searchParams = router.query;


  useEffect(() => {
        const courseId = searchParams.get('courseId') || '';
        let courseName = searchParams.get('courseName') || '';
        courseName =  courseName.replace(/\s+/g, '');
        courseName = decodeURIComponent(courseName);
        setCourseId(courseId);
        setCourseName(courseName);
        console.log("ready for databse: course ID and Name." + courseId + courseName);
        fetchData(courseName);
  }, [courseName]);

  //-----------------fetch database的items----------------
  async function fetchData(courseName:string) {
    console.log("this is the course name now! :" + courseName);
    const requestBody = {
      hasStartKey: false,
      startKey: null,
      courseID: courseName.replace(/\s+/g, ''),
      // courseID: "20233-EE542",
      readLimit: "50",
      // page: currentPage, // 当前页码
      // pageSize: pageSize, // 每页条目数
      // readLimit: totalItems //total items

      // "hasStartKey": false, 
      // "startKey": {"ID": "8085941781210758542", "CreatedTime":"2024-03-04T14:23:53.473605"},
      // "courseID": "EE450",
      // "readLimit": "5"
    };

    try {
          const response = await fetch('http://lax.nonev.win:5000/readDB', {
      // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/readDB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log(data.result.returned_count);
      // setItems(data.result.items);
      const items = data.result.items || [];
      setItems(items);
      setTotalItems(data.result.returned_count);
    } catch (error) {
      console.error('There was an error fetching the items:', error);
    } finally {
      setIsLoading(false);
    }
  }

 //--------------------------edit item----------------------------------

  //打开某一项单独edit的视图(打开modal view, upload之后用 handleUpdateItem)
  const handleEdit = (itemId:string) => {
    console.log('Editing item with ID:', itemId);
    const itemToEdit = items.find(item => item.ID === itemId);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsEditModalVisible(true);
      form.setFieldsValue({
        question: itemToEdit.OriginalText.split("answer :")[0].trim().replace("questions :",""),
        answer: itemToEdit.OriginalText.split("answer :")[1]?.trim() || '' // Use optional chaining and default to empty string if second part is undefined
      });
    }
  };

  //提交edit某一个item的database请求
  const handleUpdateItem = async (values:FormValues) => {
    try {
      const response = await fetch('http://lax.nonev.win:5000/itemUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID: courseName,
          primary_key: { ID: editingItem.ID, CreatedTime: editingItem.CreatedTime },
          updateContent: `Question: ${values.question} Answer: ${values.answer}`,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      message.success(data.message);
      fetchData(courseName);
      setIsEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('There was an error updating the item:', error);
      message.error('Failed to update the item.');
    }
  };

  //------------------------ delete item ----------------------
  const handleDelete = (itemId:string) => {
    const itemToDelete = items.find(item => item.ID === itemId);
    if (!itemToDelete) {
      console.error('Item not found');
      return;
    }
    // 弹出确认删除的对话框
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        console.log('Deleting item with ID:', itemId);
        console.log("this is the course name now! :" + courseName);
        // 构造请求体
        const requestBody = {
          courseID: courseName,
          // courseID: "20233-EE542",
          primary_key: {
            ID: itemToDelete.ID,
            CreatedTime: itemToDelete.CreatedTime
          }
        };
  
        try {
          // 发送删除请求
          const response = await fetch('http://lax.nonev.win:5000/itemDelete', {
          // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/itemDelete', {

            
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          message.success('Item deleted successfully');
  
          fetchData(courseName); 

        } catch (error) {
          console.error('There was an error deleting the item:', error);
          message.error('Failed to delete the item.');
        }
      },
      okText: "Delete",
      okButtonProps : {style:{color: 'black', borderColor:'gray'}}
    });
  };

  

  
  //---------------------add item--------------------------

  //打开add item视图
  const handleAddItem = () => {
    // setEditingItem({ ID: '', CreatedTime: '', OriginalText: '' });
    setIsModalVisible(true);
    form.resetFields();
  };

  //提交add item的请求到database
  const handleSubmitForm = async (values:FormValues) => {
    try {
      // Construct the request body
      const requestBody = {
        courseID: courseName,
        fileID: courseName+"_Piazza",
        content: {
          "0": `Question: ${values.question} Answer: ${values.answer}.`
        }
      };

      console.log("file id: "+ requestBody.fileID);
      const response = await fetch('http://lax.nonev.win:5000/upload-json', {
      // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      message.success(data.message);
      setIsModalVisible(false);
      // form.resetFields(); 
      // refresh the items list
      fetchData(courseName); 

    } catch (error) {
      console.error('There was an error uploading the item:', error);
      message.error('Failed to upload the item.');
    }
  };



  //---------------------upload video---------------------
  

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
  


  //Declare a variable for the AbortController outside of the handleUpload function
let abortController = new AbortController();

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
      const response = await fetch('http://lax.nonev.win:5000/upload-rawVideo', {
          // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/upload-rawVideo', {
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

  
//----------------------delete selected--------------------

//选择的items
const handleSelectItem = (itemId:string, checked:boolean) => {
  const updatedSelection = new Set(selectedItems);
  if (checked) {
    updatedSelection.add(itemId);
  } else {
    updatedSelection.delete(itemId);
  }
  setSelectedItems(updatedSelection);
};
//interate删除选择的items 
const handleDeleteSelected = () => {
  Modal.confirm({
    title: 'Are you sure you want to delete selected items?',
    content: 'This action cannot be undone.',
    onOk: async () => {
      console.log('Deleting selected items:', Array.from(selectedItems));
      //delete logic
      const deletePromises = Array.from(selectedItems).map(handleDeleteEach);
      try {
        // 等待所有删除操作完成
        await Promise.all(deletePromises);
        // 显示成功消息
        message.success('All selected items deleted successfully');
        fetchData(courseName);
      } catch (error) {
        // 如果出现错误，这里可以捕获并处理
        message.error(`Failed to delete one or more items: ${(error as Error).message}`);
      }
    },
    okText: "Delete",
    okButtonProps : {style:{color: 'black', borderColor:'gray'}}
  });
};
//delete item without open confirm model
  const handleDeleteEach = async (itemId:string) => {
    const itemToDelete = items.find(item => item.ID === itemId);
    if (!itemToDelete) {
      console.error('Item not found');
      return Promise.reject(new Error('Item not found')); 
    }

    console.log('Deleting item with ID:', itemId);
    console.log("this is the course name now! :" + courseName);

    const requestBody = {
        courseID: courseName,
        primary_key: {
        ID: itemToDelete.ID,
        CreatedTime: itemToDelete.CreatedTime
      }
    };

    try {
      const response = await fetch('http://lax.nonev.win:5000/itemDelete', {
      // const response = await fetch('https://tr1d2wl0fl.execute-api.us-east-2.amazonaws.com/itemDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Optionally refresh the list or update state directly
      setItems(prevItems => prevItems.filter(item => item.ID !== itemId));
      return data;
    } catch (error) {
      console.error('There was an error deleting the item:', error);
      // message.error('Failed to delete the item.');
      return Promise.reject(error);
    }
  };



  return (
    <div>
      <Title level={2}>{courseName} Database</Title>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<PlusOutlined />} onClick={handleAddItem}>Add Item</Button>
        <Button icon={<UploadOutlined />} onClick={() => setIsUploadModalVisible(true)} style={{ marginLeft: 8 }}>Upload Video</Button>
        <Button danger onClick={handleDeleteSelected} style={{ marginLeft: 8 }}>Delete Selected</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {items.map((item, index) => (
            <Card key={index} style={{ marginBottom: 16 }} actions={[
              <EditOutlined key="edit" onClick={() => handleEdit(item.ID)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(item.ID)} />,
            ]}>
              <Checkbox style={{ marginBottom: '10px' }} checked={selectedItems.has(item.ID)} onChange={(e) => handleSelectItem(item.ID, e.target.checked)} />
              <p>{"Question: " + item.OriginalText.split("answer :")[0].trim().replace("questions :","")}</p>
              <br></br>
              <hr />
              <br></br>
              <p>{"Answer: " + item.OriginalText.split("answer :")[1]}</p>
            </Card>
          ))}
        </div>
      )}
       {/* 分页组件 */}
        {/* <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
            fetchData(); // 重新获取分页数据
          }}
        /> */}
      {/* Modal component for adding a new item */}
      <Modal title="Add Item" open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} okText="Submit" okButtonProps={{style:{color: 'black', borderColor:'gray'}}}>
        <Form form={form} onFinish={handleSubmitForm}>
          <Form.Item name="question" label="Question" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }}/>
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }}/>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal component for editing an item */}
      <Modal title="Edit Item" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)} onOk={() => form.submit()} okText="Submit" okButtonProps={{style:{color: 'black', borderColor:'gray'}}}>
      <Form form={form} onFinish={handleUpdateItem}>
        {/* <Form form={form} onFinish={handleUpdateItem} initialValues={{ question: editingItem.OriginalText.split("answer :")[0].trim().replace("questions :", ""), answer: editingItem.OriginalText.split("answer :")[1] }}> */}
          <Form.Item name="question" label="Question" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }}/>
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input style={{ borderRadius: '6px' }}/>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal component for file upload */}
      <Modal
        title="Upload File"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          // setFileList([]); // Clear the file list when the modal is closed
          // abortController.abort(); // Abort the upload process
        }}
        footer={[
          <Button key="back" onClick={() => {
            setIsUploadModalVisible(false);
            setFileList([]); // Clear the file list when cancelling
            abortController.abort(); // Abort the upload process
          }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" style={{color: "black", borderColor:"gray"}} onClick={handleUpload}>
            Upload
          </Button>,
        ]}
      >
        <Upload
          beforeUpload={beforeUpload}
          multiple={false}
          fileList={fileList}
          onRemove={() => setFileList([])} // Allow removing the file, clearing the state
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Modal>
    </div>
  );
}



