import request from '@/utils/request';

export async function getPhoto(params) {
  return request('/api/photo', {
    params,
  });
}

export async function addPhoto(params) {
  return request('/api/photo', {
    method: 'POST',
    data: params,
  });
}

export async function editPhoto(params) {
  return request('/api/photo', {
    method: 'PUT',
    data: params,
  });
}

export async function delPhoto(id) {
  return request(`/api/photo/${id}`, {
    method: 'DELETE',
  });
}
