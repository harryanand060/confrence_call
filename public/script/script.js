const socket = io('/')

const myVideo = document.createElement('video')
const videoGrid = document.getElementById('video-grid')

// set Peer (first parameter undefined, and set path, host can be server host either production host and port)
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})

myVideo.muted = true

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        console.log(call)
        call.answer(stream)
        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    // socket receive server request
    socket.on('user-connected', userId => {
        setTimeout(function() {
            connectToNewUser(userId, stream)
        }, 500)
    })
});

// peer connection open
// socket sent request to server

peer.on('open', id => {
    //personal id user who start connection
    socket.emit('join-room', ROOM_ID, id);
})


// Get message once new user join the room
const connectToNewUser = (userId, stream) => {
    console.log(stream)
    console.log(userId)
    const call = peer.call(userId, stream)
    console.log(call)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    console.log(video)
    video.srcObject = stream
    playVideo(video)
    videoGrid.append(video)
}


const playVideo = (video) => {
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
}

let text = $('input')


$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit('message', text.val())
        text.val('')
    }
})

socket.on('create_message', message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
})


const scrollToBottom = () => {
    var d = $('.main__chat_window')
    d.scrollTop(d.prop('scrollHeight'))
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false
        setUnmuteButton()
    } else {
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled = true

    }
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true

    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
    document.querySelector('.main__video_button').innerHTML = html
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video"></i><span>Play Video</span>`
    document.querySelector('.main__video_button').innerHTML = html
}