import { Metadata } from 'next'
import { FC } from 'react'
import Auth from './Auth'

export const metadata: Metadata = {
    title:'Авторизация'
}

const page: FC = () => {
  return <Auth/>
}

export default page