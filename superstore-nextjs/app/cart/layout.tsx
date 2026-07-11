import React from "react";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <section>
      {children}
   </section>

  );
}