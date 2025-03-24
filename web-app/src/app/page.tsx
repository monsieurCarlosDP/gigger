'use client';
import { useServiceContext } from "@/context/service-context/ServiceContext";
import { DataObject, ISongListItemViewModelV1Body } from "@/data/api-client/data-contracts";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";


export default function Home() {

  const {songService} = useServiceContext();
  const [songs, setSongs] = useState<DataObject<ISongListItemViewModelV1Body>[]>([]);
  useEffect(()=>{
    songService.getSongs().then((res)=>{
      setSongs(()=>res.data);
    })
  },[songService])

  return (
    <div>
      <Button variant="contained">test</Button>
      <Avatar alt="Carlos Díaz" />
      {
      songs && songs.map( song => <div key={song.id}>{song.attributes.Title} </div>  )
      }
    
    </div>
  );
}
