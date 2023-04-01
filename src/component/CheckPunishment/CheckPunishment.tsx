import { Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import parse from 'html-react-parser';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './CheckPunishment.scss';

const CheckPunishment = () => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handelCheck = async (values: { BienKS: string; Xe: string }) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('BienSo', values.BienKS);
      formData.append('LoaiXe', values.Xe);

      const res = await axios.post(`https://phatnguoixe.com/1026`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(res.data);
      message.success('Kiểm tra thành công');
      setLoading(false);
    } catch (error) {
      message.error('Kiểm tra thất bại');
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='check-punishment'>
      <Form layout='horizontal' onFinish={handelCheck} onFinishFailed={onFinishFailed}>
        <Form.Item
          name='BienKS'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập biển số xe',
            },
          ]}
        >
          <Input className='check-punishment-input' placeholder='Nhập biển số' />
        </Form.Item>
        <Form.Item
          name='Xe'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại xe',
            },
          ]}
        >
          <Select
            className='check-punishment-select'
            placeholder='Chọn loại xe'
            options={[
              { value: '1', label: 'Ô tô' },
              { value: '2', label: 'Xe máy' },
              { value: '3', label: 'Xe máy điện' },
            ]}
          />
        </Form.Item>
        <ReCAPTCHA
          ref={recaptchaRef}
          size='invisible'
          sitekey='6LenekwlAAAAAHFciDXOPcC_L8kgJTq1lv-UOnup'
          style={{
            display: 'none',
          }}
        />
        <Form.Item className='form-button'>
          <Button
            className='check-punishment-btn'
            type='primary'
            htmlType='submit'
            loading={loading}
          >
            Kiểm tra
          </Button>
        </Form.Item>
      </Form>
      <div className='result'>{result && parse(result)}</div>
    </div>
  );
};

export default CheckPunishment;
