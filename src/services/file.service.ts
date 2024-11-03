import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

class FileService {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return axiosWithAuth.post(`${API_URl.file('upload-image')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return axiosWithAuth.post(`${API_URl.file('upload-video')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
     formData.append('file', file);

    return axiosWithAuth.post(`${API_URl.file('upload-avatar')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export default new FileService();
