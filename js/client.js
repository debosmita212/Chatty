const socket=io('http://localhost:8000')

//Get DOM elements in respective JS variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container");
//Audio played on receiving messages
var audio=new Audio('ring.mp3');

//function which will append event info to the container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
    
}
//ask for user name and let server know
const name1=prompt("Enter your name to join");
socket.emit('new-user-joined', name1);

//new user joins, receive his/her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,`right`)
})

//if server sends a msg, receive it
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,`left`)
})
//if a user leaves chat,append info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,`right`)
})

//if form gets submitted send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,`right`)
    socket.emit('send',message);
    messageInput.value='';
})