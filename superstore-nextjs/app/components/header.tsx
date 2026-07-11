 "use client";
import Link from "next/link";

export default function Header() {

const navlinks = [
  {name: 'StoreFront', href: '/storefront'},
  {name:'Cart', href: '/cart'},
  {name: 'Admin', href: '/admin'}
]

return(
  <header>
    <h1>SuperStore</h1>

    <nav>
      <ul>
        {navlinks.map((link) => (
        <li key={link.href}>
          <Link href={link.href} ><p>{link.name}</p></Link>
        </li>
      ))}
      </ul>
    </nav>
    
  </header>
);


}