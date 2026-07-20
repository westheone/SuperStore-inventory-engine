import Link from "next/link";

const navlinks = [
  {name: 'StoreFront', href: '/store'},
  {name:'Cart', href: '/cart'},
  {name: 'Admin', href: '/admin'}
]

export default function NavLinks () {

  return(
    <section className="nav-container" >
     <div><h1>Super Store</h1></div>

        <nav>
          <ul>
            {navlinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} ><h2>{link.name}</h2></Link>
            </li>
          ))}
          </ul>
        </nav> 
    </section>
  )
}