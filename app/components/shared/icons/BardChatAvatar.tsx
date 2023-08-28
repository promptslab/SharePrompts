import Image from 'next/image'
import React from 'react'

const BardChatAvatar = () => {
  return (
    <Image src="/bard_chat_logo.svg" width={0} height={0} className="w-[32px] h-[32px] mr-2" alt="Bard Chat logo" />
  )
}

export default BardChatAvatar
