/* eslint-disable */

// updateData
import axios from 'axios';
import { showAlert } from './alerts';

// type  is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/users/${
      type === 'password' ? 'updateMyPassword' : 'updateMe'
    }`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully!`);
      //   window.setTimeout(() => {
      //     location.reload('/me');
      //   }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
