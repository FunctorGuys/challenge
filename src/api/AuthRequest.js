import Request from './Request';

export const signUp = (data) => {
  return Request().post('/mailing-list', data);
};
