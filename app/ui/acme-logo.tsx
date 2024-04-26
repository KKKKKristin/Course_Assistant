// import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import logoImage from '@/public/Logo2_White.png';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
    {/* </div> <div className="flex justify-center items-center"> */}
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <Image 
        src={logoImage} 
        alt="Logo" 
        // width={200}  // 设置图像宽度
        // height={100} // 设置图像高度
        className="h-15 w-30" 
      />
      {/* <p className="text-[44px]">CourseAssistant</p> */}

    </div>
  );
}
