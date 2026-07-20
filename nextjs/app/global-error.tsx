"use client"

import "./globals.css"

export default function GlobalError() {
  return(
    <html>
      <body>
        <div>
          <h2>Sorry something went wrong!</h2>
          <button onClick={() => {window.location.reload()}}>Reload</button>
        </div>
      </body>
    </html>
  )
}