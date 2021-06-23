# Plan of Action
- Initialize NodeJs project
- Initialize our first view
- Create Room Id
- Add our own video 
- Add the ability to allow others to stream thier video
- add styling
- Add the ability to create message
- add mute button
- add stop video button


# COmmand



- Initialize NodeJs project
    - npm init
    - npm install express
    - npm install nodemon

    Step 1: Set Server
            const express = require('express');
            const app = express();
            const http = require('http');
            const server = http.Server(app);
            app.get('/', (req, res) => {
                res.status(200).send('Hello World');
                res.render('room');
            });

            server.listen(3030);

- Initialize our first view
    
    - npm install ejs

    Step 2: Set View Engine 
        app.set('view engine', 'ejs');

        Create View using ejs file (embeded java script)
        note: use !+ enter (HTML default format create)

- Create Room Id
    - npm install uuid

        it create unique ID. with the help of this ID we will create room id.

        const { v4: uuidv4 } = require('uuid');

        app.get('/', (req, res) => {
            // res.status(200).send('Hello World');
            res.redirect(`/${uuidv4()}`);
        });

        app.get('/:room', (req, res) => {
            // res.status(200).send('Hello World');
            res.render('room', { roomId: req.params.room });
        });

- Add our own video 

        Add script.js file in public folder 

            const myVideo = document.createElement('video');
            const videoGrid = document.getElementById('video-grid');
            myVideo.muted = true;

            let myVideoStream;
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myVideoStream = stream;
                addVideoStream(myVideo, stream);
            });

            const addVideoStream = (video, stream) => {
                video.srcObject = stream;
                console.log(video);
                playVideo(video);
                videoGrid.append(video);
            }

            const playVideo = (video) => {
                video.addEventListener('loadedmetadata', () => {
                    video.play()
                });
            }
        
        Add inlude script.js file in room.ejs file, means in view page

            <div id="video-grid"></div>
            <script src="script/script.js"></script> 
        
        Add style.css and  inlcude in view page

            #video-grid {
                display: flex;
                justify-content: center;
            }

            video {
                height: 300px;
                width: 400px;
                object-fit: cover;
            }

- Add the ability to allow others to stream thier video

        https://socket.io/

        https://socket.io/get-started/chat/

        we will use socket for real time communication. socket io use for asyncronous communication.
        there is difference in Http and socket communication with server and client

        http: only client request to server and server response back to client. means one way communication channel

        socket: in socket server and client both can request to each other and response back. means two way communication channel. server can request to client at any time. it will work like a tude where client and server can interact with each other.



        #command 
            npm install socket.io

        Server.js
            import
            const io=require('socket.io')(server);

            # socket connection 
            io.on('connection', socket => {
                socket.on('join-room', (room_id) => {
                    console.log('joined room');
                    socket.join(room_id)

                    // Braoadcast message to the group that user connected
                    socket.to(room_id).broadcast.emit("user-connected");
                })
            })

        script.js

            import 
            const socket = io('/');

            # broadcast or sent request to server
           // socket sent request to server
                socket.emit('join-room', ROOM_ID);

                // socket receive server request
                socket.on('user-connected', () => {
                    connectToNewUser();
                });

                // Get message once new user join the room
                const connectToNewUser = () => {
                    console.log('new user');
                }

        room.ejs

            script src="/socket.io/socket.io.js"></script>


- peer JS - https://peerjs.com/
- WebRTC
        #command
            npm install peer

        
