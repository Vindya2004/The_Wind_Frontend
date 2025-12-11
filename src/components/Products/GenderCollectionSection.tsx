import React from 'react'
import MenShoes from "../../assets/MenShoes.webp"
import ladyShoes from "../../assets/ladyShoes.avif"
import { Link } from 'react-router-dom'

const GenderCollectionSection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex gap-8'>
  <div className='relative flex-1 p-4'>
    <img
      src={ladyShoes}
      alt="Women's collection"
      className='w-full h-[700px] object-cover'
    />
    <div className='absolute bottom-12 left-12 bg-white bg-opacity-90 p-4 rounded-md'>
      <h2 className='text-2xl font-bold text-gray-900 mb-3'>
        Women's Collection
      </h2>
      <Link to="/collection/all?gender=Women"
      className='text-gray-900 underline
      '>
        Shop Now
      </Link>
    </div>
  </div>
  {/* Men's Collection */}
  <div className='relative flex-1 p-4'>
    <img
      src={MenShoes}
      alt="Men's collection"
      className='w-full h-[700px] object-cover'
    />
    <div className='absolute bottom-12 left-12 bg-white bg-opacity-90 p-4 rounded-md'>
      <h2 className='text-2xl font-bold text-gray-900 mb-3'>
        Men's Collection
      </h2>
      <Link to="/collection/all?gender=Men"
      className='text-gray-900 underline
      '>
        Shop Now
      </Link>
    </div>
  </div>
</div>

    </section>
  )
}

export default GenderCollectionSection