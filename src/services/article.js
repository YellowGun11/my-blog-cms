import request from '@/utils/request';

export async function getArticle(params) {
  return request('/api/article', {
    params,
  });
}

export async function addArticle(params) {
  return request('/api/article', {
    method: 'POST',
    data: params,
  });
}

export async function editArticle(params) {
  return request('/api/article', {
    method: 'PUT',
    data: params,
  });
}

export async function delArticle(id) {
  return request(`/api/article/${id}`, {
    method: 'DELETE',
  });
}
