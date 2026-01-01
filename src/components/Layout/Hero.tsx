
import heroImage from "../../assets/heroImg.webp";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
  
 <section className='relative'>
  <img
    src={heroImage}
    alt="Main"
    className='w-full h-[400px] md:h-[400px] lg:h-[500px] object-cover'
  />

  {/* Center Overlay */}
  <div className='absolute inset-0 bg-black/5 flex items-center justify-center'>
    <Link
      to="#"
      className='bg-white text-gray-950 px-6 py-3 rounded-sm text-lg font-semibold shadow-md translate-y-30'
    >
      Shop Now
    </Link>
  </div>
</section>


  )
}

export default Hero
