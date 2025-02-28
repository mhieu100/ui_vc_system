import {
  Descriptions, 
} from 'antd'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import '../../styles/reset.scss';
import ModalProfile from '../../components/modal/modal.profile';
import { fetchAccount } from '../../redux/slice/accountSlide';


const ProfilePage = () => {
  const user = useSelector((state) => state.account.user);
   

  const dispatch = useDispatch();

  const reloadData = () => {
    dispatch(fetchAccount()); // Gọi API để lấy dữ liệu mới nhất
  };

  const items = [
    {
      label: 'Tên đầy đủ',
      children: user.fullname,
    },
    {
      label: 'Email',
      children: user.email,
    },
    {
      label: 'Số điện thoại',
      children: user.phone ? user.phone : (<span>Cập nhật số điện thoại</span>),
    },
    {
      label: 'Địa chỉ',
      children: user.address ? user.address : (<span>Cập nhật địa chỉ</span>),
    },
    {
      label: 'Ngày sinh',
      children: user.birthday ? user.birthday : (<span>Cập nhật ngày sinh</span>),

    },
    {
      label: 'Action',
      children: <a onClick={() => setOpenModal(true)} className=''>Update Profile</a>,
    },

  ];

  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Descriptions title="Thông tin cá nhân" items={items} layout="vertical" bordered />
      <ModalProfile openModal={openModal} setOpenModal={setOpenModal} reloadData={reloadData} user={user} />
    </>

  )
}

export default ProfilePage