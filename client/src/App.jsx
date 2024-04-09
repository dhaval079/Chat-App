import React, { useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import {Box, Button, Container, Stack, TextField, Typography} from '@mui/material'
const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message,setMessage] =useState("");
  const [socketID,setSocketid] =useState("");
  const [room,setRoom] =useState("");
  const [messages,setMessages] =useState([]);
  const [roomName,setRoomName] =useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message",{message , room});
    setMessage("");
  } 

  const joinRoomHandler = (e) => {
    e.preventDefault(); 
    socket.emit("join-room",roomName);
    setRoomName("");
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketid(socket.id);
      console.log("connected",socket.id)
    })

    socket.on("welcome",(s)=>{console.log(s)})

    socket.on("receive-message",(data)=>{
      setMessages((messages) => [...messages,data]);
      console.log(data);
    })

    return socket.on("disconnect" , () =>{
      console.log("User Disconnected" ,socket.id)
    })
  },[])

  return (
    <Container maxWidth="sm">
    <Box sx={{height : 300}} />
    <Typography variant="h6" align="center" gutterBottom>
      {socketID}
    </Typography> 

    <form onSubmit={joinRoomHandler}>
    <h5>Join Room</h5>
    <TextField value={roomName} onChange={(e)=>setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined'/>
      <Button type='submit' variant="contained" color='primary'>
        Join
      </Button>
    </form> 

    <form onSubmit={handleSubmit}>
      <TextField value={message} onChange={(e)=>setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined'/>
      <TextField value={room} onChange={(e)=>setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined'/>
      <Button type='submit' variant="contained" color='primary'>
        Send
      </Button>
    </form>
    <Stack>
    {  messages.map((m,i) => (
        <Typography key={i} variant="body1" gutterBottom>
          {m}
        </Typography>
      ))}
    </Stack>
    </Container>
  )
}

export default App;
