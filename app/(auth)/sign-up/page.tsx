import AuthForm from '@/components/AuthForm'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Prepify account to start practicing mock interviews.',
}

const page = () => {
  return (
    <AuthForm type="sign-up"/>
  )
}

export default page
