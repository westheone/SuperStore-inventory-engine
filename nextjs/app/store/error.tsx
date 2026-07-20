"use client"

import { useRouter } from "next/navigation"
import { startTransition } from "react"

export default function Error({error, reset}:{error: Error, reset: () => void}) {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }
  
  return (

    <div>
      <p>{error.message}</p>
      <button className="button-look" onClick={reload}>Try again</button>
    </div>
  )
}