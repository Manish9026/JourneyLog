import React, { useEffect ,useState} from 'react'
import { useDispatch ,useSelector} from 'react-redux'

// import data from '../../data/single.json'
import { MdStar } from 'react-icons/md'
import { MovieContainer } from '../Home/Home'
import movi from '../../data/moviData2.json'
import { getMovieData } from '../../slices/singleMoviPageSlice'
import { Link, useLocation } from 'react-router-dom'
import Loader from '../../component/loader/Loader'
const monthCode = ["january", "febuary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

const MoviePage = () => {
    const dispatch=useDispatch();
    const location=useLocation();
    const {data,loading}=useSelector(state=>state.singleMoviPage);
    const [param,setParam]=useState([])


if (data && Object.keys(data).length!=0 )
    return (
        <div className='w-full max-w-[1300px] h-full '>
           { loading && <Loader/>}
            {/* movi hero & card section */}
            <span className=" flex max-h-[500px] p-10 h-full bg-cover bg-no-repeat w-full movi-card relative bg-red-400 bg-center" style={{backgroundImage:`url(${data?.primaryVideos?.edges[0]?.node?.thumbnail?.url})`}} >
                {/* <img className='absolute' src={data.primaryVideos.edges[0].node.thumbnail.url} alt="" /> */}
                {/* {
                    // data.primaryImage.url
                } */}
                <div className="card flex w-full z-12 items-center max-h-[200px text-white">
                    <span className="img">

                        <img className=" max-w-[300px] h-[300px]" src={data?.primaryImage?.url} alt="" />
                    </span>
                    <span className="conent justify-center px-4 py-2 w-full gap-2  flex flex-col h-full">
                        <h4 className='text-4xl font-semibold'>{data?.titleText?.text}</h4>
                        <span className='text-md flex gap-2 list-none'>
                            <li>{data?.runtime?.displayableProperty?.value?.plainText}</li>
                            <li>{data?.genres?.genres.map((genres, id) => {
                                if (id >= 0 && data.genres.genres.length - 1 > id)
                                    return genres.text + ","
                                else
                                    return genres.text
                            })}</li>
                            <li></li></span>
                        <span className=" flex gap-5 list-none bg-blue-200 max-w-[300px] rounded-md px-2 py-2"><li className='flex relative gap-2'><MdStar className='relative top-1' />{data?.ratingsSummary?.aggregateRating}/10</li>
                            <li>{(data?.ratingsSummary?.voteCount / 1000).toFixed(1) + "K"} votes</li>
                        </span>

                        <div className="span bg-blue-500 max-w-[300px] p-2 rounded-md relative ">
                            <span>{data?.releaseDate.day} {monthCode.filter((value, id) => { if (id == data?.releaseDate.month) return value })} {data.releaseDate.year}</span>

                        </div>
                        <span className="bg-white opacity-70 rounded-full size-[40px] flex text-blue-900 items-center justify-center">
                            {data.isAdult?"A":"UA"}
                        </span>


                        <Link to={`/buyticket/${data?.movi_id}/${data.id}`} className='bg-pink-700 mt-10 rounded-md px-5 py-2 max-w-[200px]'>book now</Link>



                    </span>

                </div>

            </span>
            {/* movie-discription section */}
        <span className="w-full flex flex-col p-2">
            <span className="heading text-lg font-semibold">About the movie</span>
            <span className='py-5 border-solid border-b-2 border-sky-500 '><p>{data?.plot?.plotText?.plainText}</p></span>

        </span>
        {/* cast container */}
        <span className="w-full flex flex-col p-2">

            {/* heading */}
            <span className="heading text-lg font-semibold">Cast</span>
            {/* circle card */}
            <span className='py-5 border-solid flex overflow-auto border-b-2 border-sky-500 gap-2'>

            {
                data?.cast?.edges?.map((cast,id)=>{
                    return(
                        <span key={id} className='flex w-full  flex-col justify-center min-w-[150px] max-w-[150px]'>
                        <img className='size-[150px] text-center rounded-full' loading="lazy" src={cast?.node?.name?.primaryImage?.url} alt="" />
                        <p className='text-center'>{cast.node.name.nameText.text}.</p>
                    </span>
                    )
                })
            }
          
            </span>

        </span>
            <MovieContainer title={"You might also like"} data={movi}/>
        </div>
    )
    else return(
        <Loader style={{position:"relative"}} />
    )
}

export default MoviePage