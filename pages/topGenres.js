import {getSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import BarChart from '../components/BarChart';
import Loading from '../components/Loading';
import {useTopArtists,useTopArtistssMid, useTopArtistsLong } from '../lib/fetcher'

export default function TopArtistsPage() {
  const {artists,isLoadingTracks,isErrorTracks} = useTopArtists();
  const {artistsMid,isLoading2,isError2} = useTopArtistssMid();
  const {artistsLong,isLoading3,isError3} = useTopArtistsLong();
  const [ArtistList, setArtistList] = useState()
  const [tabs, setTabs] = useState("short")

 useEffect(() => {
    if(tabs=="long"){
      setArtistList(artistsLong);
    }else if (tabs=="mid"){
      setArtistList(artistsMid);
    }else if (tabs=="short"){
      setArtistList(artists);
    }else{
      setArtistList(artists);
    }
   
 },);


   const genres = [ArtistList?.map((artist) => artist.genres).flat()].flat()
   //tally the genres
   const tally = genres.sort().reduce((genre,name) => (genre[name] ? ++genre[name]:(genre[name] = 1),genre),{})

   let data = []
   for (let x in tally){
     data.push({"genre": x, "count":tally[x]})
   }
   data=[...data.sort((curr, next) => next.count - curr.count)]


  if(isLoadingTracks){
    return <Loading />
  } 

  return (
      <>
        <section className='flex flex-col xl:flex-row gap-8 md:items-center'>
            <div className='md:text-center lg:text-left'>
                <h1 className='text-5xl'>Top Genres</h1>
                <p className="text-gray inline-flex gap-2 group">Based on Spotify Activity
                <i className="ri-star-smile-line text-green2"></i>
                </p>
            </div>
            <div className='flex flex-row gap-1 md:gap-4'>
            <a className={(tabs=="long")?"btn bg-white text-black":"btn "} onClick={()=>setTabs("long")}>All Time</a>
            <a className={(tabs=="mid")?"btn bg-white text-black":"btn "} onClick={()=>setTabs("mid")}>Last 6 Months</a>
            <a className={(tabs=="short")?"btn bg-white text-black":"btn "} onClick={()=>setTabs("short")}>Last Month</a>

            </div>
          </section>
          <hr className='my-8'></hr>
          <session className="flex flex-col lg:flex-row lg:gap-16">
        
              {(data.length != 0)?
                <BarChart data={data} />
              :
              <p className='text-gray '> Your spotify activity does not have sufficient data !</p>
            }

        </session>

      </>
 
  );
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  if(!session)
    return{
      redirect:{
        destination: 'signin',
        permanent: false,
      }
    };
  return {
    props: {session}
  }
}