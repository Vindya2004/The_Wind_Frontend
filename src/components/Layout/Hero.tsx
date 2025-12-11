// import React from 'react'
// import MainImage from "../../assets/MainImage.jpeg"

// const Hero = () => {
//   return (
//     <section>
//         <img src="{MainImage}" alt="" />
//     </section>
//   )
// }

// export default Hero

import React from 'react'
import heroImage from "../../assets/heroImg.webp";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    // <section className='relative'>
    //   <img src={heroImage} alt="Main" className='w-full h-[400px] md:h-[400px] lg:h-[500px] object-cover
    //   ' />
    //   <div className='absolute inset-0 bg-black/5 flex items-center justify-center'>
    //     <div className='text-center text-black p-6'>
    //         <h1 className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>footwere</h1>
    //         <p className='text-sm tracking-tighter md:text-lg mb-6'>
    //             Explore our foot ware with fast worldwide shipping.
    //         </p>
    //         <Link 
    //             to="#"
    //             className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg'>
    //                 Shop Now
    //             </Link>


    //     </div>
    //   </div>
    // </section>
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
