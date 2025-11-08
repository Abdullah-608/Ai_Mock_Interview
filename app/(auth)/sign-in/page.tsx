import AuthForm from '@/components/AuthForm'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Prepify account to access your dashboard.',
}

const page = () => {
  return (
    <AuthForm type="sign-in"/>
  )
}

export default page
