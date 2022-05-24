import request from '@/utils/request';

export async function getClassify(params) {
  return request('/api/classify', {
    params,
  });
}

export async function addClassify(params) {
  return request('/api/classify', {
    method: 'POST',
    data: params,
  });
}

export async function editClassify(params) {
  return request('/api/classify', {
    method: 'PUT',
    data: params,
  });
}

export async function delClassify(id) {
  return request(`/api/classify/${id}`, {
    method: 'DELETE',
  });
}
