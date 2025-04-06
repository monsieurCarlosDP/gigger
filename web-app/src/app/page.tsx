'use client';
import { useServiceContext } from "@/context/service-context/ServiceContext";
import { DataObject, ISetlistListItemViewModelV1Body, ISongListItemViewModelV1Body } from "@/data/api-client/data-contracts";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";


export default function Home() {

  const {songService,setlistService} = useServiceContext();
  const [songs, setSongs] = useState<DataObject<ISongListItemViewModelV1Body>[]>([]);
  const [setlists, setSetlists] = useState<DataObject<ISetlistListItemViewModelV1Body>[]>([]);
  useEffect(()=>{
    songService.getSongs().then((res)=>{
      setSongs(()=>res.data);
    })

    setlistService.getSetlists().then(res =>{
      setSetlists(()=>res.data);
    })

  },[songService,setlistService])

  return (
    <div>
      <Button variant="contained">test</Button>
      <Avatar alt="Carlos Díaz" />
      {
      songs && songs.map( song => <div key={song.id}>{song.attributes.Title} </div>  )
      }
      {
        setlists && setlists.map( setlist => <div key={setlist.id}>{setlist.attributes.Name} </div>)
      }
    </div>
  );
}
