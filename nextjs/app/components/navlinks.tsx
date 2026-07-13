import Link from "next/link";

const navlinks = [
  {name: 'StoreFront', href: '/store'},
  {name:'Cart', href: '/cart'},
  {name: 'Admin', href: '/admin'}
]

export default function NavLinks () {

  return(
    <section>
     <h1>Super Store</h1> 

    <nav>
      <ul>
        {navlinks.map((link) => (
        <li key={link.href}>
          <Link href={link.href} ><p>{link.name}</p></Link>
        </li>
      ))}
      </ul>
    </nav>
    </section>
  )
}