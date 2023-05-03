import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.scss'

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <Image src="/logo.png" alt="barbershop logo" width={100} height={100}/>
      </div>
      <ul className={styles.navbar__links}>
        <li className={styles.navbar__link}>
          <Link href="/">
            Quiénes somos
          </Link>
        </li>
        <li className={styles.navbar__link}>
          <Link href="/" className={styles.navbar__link}>
            Servicios
          </Link>
        </li>
        <li className={styles.navbar__link}>
          <Link href="/">
            Galería
          </Link>
        </li>
        <li className={styles.navbar__link}>
          <Link href="/">
            Ubicación
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
