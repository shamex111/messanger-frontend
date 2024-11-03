export const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api` as string;
export const SERVER_URL_BASE = `${process.env.NEXT_PUBLIC_SERVER_URL}` as string;
export const API_URl = {
    root: (url = '') => `${url ? url : ''}`,

    auth: (url = '') => API_URl.root(`/auth/${url}`),
    channel: (url = '') => API_URl.root(`/channel/${url}`),
    config: (url = '') => API_URl.root(`/config/${url}`),
    file: (url = '') => API_URl.root(`/file/${url}`),
    group: (url = '') => API_URl.root(`/group/${url}`),
    message: (url = '') => API_URl.root(`/message/${url}`),
    notification: (url = '') => API_URl.root(`/notification/${url}`),
    chat: (url = '') => API_URl.root(`/chat/${url}`),
    user: (url = '') => API_URl.root(`/user/${url}`),
}