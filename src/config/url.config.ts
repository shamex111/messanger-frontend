export const APP_URL = process.env.NEXT_PUBLIC_APP_URL as string;

export const PUBLIC_URl = {
  root: (url = '') => `${url ? url : ''}`,

  home:() => PUBLIC_URl.root('/'),
  auth:() => PUBLIC_URl.root('/auth'),
  chat: (id: string) => PUBLIC_URl.root(`chat/${id}`),
  group: (id: string) => PUBLIC_URl.root(`group/${id}`),
  channel: (id: string) => PUBLIC_URl.root(`channel/${id}`)
};
