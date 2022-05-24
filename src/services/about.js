import request from '@/utils/request';

export async function getAbout(params) {
  return request('/api/about', {
    params,
  });
}

export async function addAbout(params) {
  return request('/api/about', {
    method: 'POST',
    data: params,
  });
}

export async function editAbout(params) {
  return request('/api/about', {
    method: 'PUT',
    data: params,
  });
}

export async function delAbout(id) {
  return request(`/api/about/${id}`, {
    method: 'DELETE',
  });
}
