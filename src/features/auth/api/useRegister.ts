import { useMutation } from '@tanstack/react-query';

import { axios } from '~config/axios';

const login = (data: any) => {
  return axios.post(`api/`, data);
};

export const useLogin = () => {
  return useMutation({
    onMutate: () => {},
    mutationFn: (data: any) => login(data),
    onSuccess: () => {},
    onError: e => {},
    onSettled: () => {},
  });
};
