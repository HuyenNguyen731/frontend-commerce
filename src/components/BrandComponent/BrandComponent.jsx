import logo1 from '../../assets/images/brand/brand-1.png'
import logo2 from '../../assets/images/brand/brand-2.png'
import logo3 from '../../assets/images/brand/brand-3.png'
import logo4 from '../../assets/images/brand/brand-4.png'
import logo5 from '../../assets/images/brand/brand-5.png'

const BrandComponent = () => {
    return (
        <div className="flex flex-nowrap justify-between items-center my-10">
            <img src={logo1} alt="brand-01" className="w-[180px] h-[50px] block"/>
            <img src={logo2} alt="brand-02" className="w-[100px] h-[50px] block" />
            <img src={logo3} alt="brand-03" className="w-[180px] h-[80px] block" />
            <img src={logo4} alt="brand-04" className="w-[150px] h-[50px] block" />
            <img src={logo5} alt="brand-05" className="w-[200px] h-[120px] block" />
        </div>
    )
}

export default BrandComponent;
