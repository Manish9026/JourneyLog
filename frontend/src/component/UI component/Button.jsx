export const Button=({className="p-2 bg-sky-300 rounded-md min-w-[100px] text-dark-100 capitalize",onClick,btnName})=>{
    return(
      <button className={className} onClick={onClick}>{btnName}</button>
    )
    }