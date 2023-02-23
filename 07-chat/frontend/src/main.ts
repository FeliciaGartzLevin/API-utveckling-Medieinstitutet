import './assets/scss/style.scss'
import { io, Socket } from 'socket.io-client'
import {
	ChatMessageData,
	ClientToServerEvents,
	NoticeData,
	ServerToClientEvents
} from '@backend/types/shared/SocketTypes'

const SOCKET_HOST = import.meta.env.VITE_APP_SOCKET_HOST

// Forms
const messageEl = document.querySelector('#message') as HTMLInputElement
const messageFormEl = document.querySelector('#message-form') as HTMLFormElement
const usernameFormEl = document.querySelector('#username-form') as HTMLFormElement

// Lists
const messagesEl = document.querySelector('#messages') as HTMLUListElement

// Views
const chatWrapperEl = document.querySelector('#chat-wrapper') as HTMLDivElement
const startEl = document.querySelector('#start') as HTMLDivElement

// User Details
let username: string | null = null

// Connect to Socket.IO server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST)

/* Min Lösning
 *
// add a message to the chat
då behöver man inserta message.content
const addMessageToChat = (message: string, ownmessage: boolean) => {

	let own = ''
	if(ownmessage){
		own = 'own-message'
	}
	return messagesEl.innerHTML += `<li class="message ${own}">${message}</li>`

} */

/* Johans lösning
*/
// Add a message to the chat
const addMessageToChat = (message: ChatMessageData, ownMessage = false) => {
	// Create a new LI element
	const messageEl = document.createElement('li')

	// Set class of LI to 'message'
	messageEl.classList.add('message')

	// If the message is from the user, add the class 'own-message'
	if (ownMessage) {
		messageEl.classList.add('own-message')
	}

	// Get human readable time
	const time = new Date(message.timestamp).toLocaleTimeString()  // "13:37:00"

	// Set the text content of the LI element to the message
	messageEl.innerHTML = ownMessage
	? `
	<span class="content">${message.content}</span>
	<span class="time">${time}</span>
	` : `
	<span class="user">${message.username}</span>
	<span class="content">${message.content}</span>
	<span class="time">${time}</span>
	`

	// Append the LI element to the messages element
	messagesEl.appendChild(messageEl)

	// Scroll to the bottom of the messages list
	messageEl.scrollIntoView({ behavior: 'smooth' })
}

// Add a notice to the chat
const addNoticeToChat = (content: string, timestamp: number) => {
	// Create a new LI-element
	const noticeEl = document.createElement('li')

	// Add `notice`-class
	noticeEl.classList.add('notice')

	// Get human readable time
	const time = new Date(timestamp).toLocaleTimeString()  // "13:37:00"

	// Set the content of the notice
	noticeEl.innerHTML = `
		<span class="content">${content}</span>
		<span class="time">${time}</span>
	`

	// Append the LI element to the messages element
	messagesEl.appendChild(noticeEl)

	// Scroll to the bottom of the messages list
	noticeEl.scrollIntoView({ behavior: 'smooth' })
}

// Show chat view
const showChatView = () => {
	startEl.classList.add('hide')
	chatWrapperEl.classList.remove('hide')
}

// Show welcome view
const showWelcomeView = () => {
	chatWrapperEl.classList.add('hide')
	startEl.classList.remove('hide')
}

// Listen for when connection is established
socket.on('connect', () => {
	console.log('💥Connected to the server', socket.id)
})

// Listen for when the server is restarting or stopping
socket.on('disconnect', () => {
	console.log('Disconnected from the server 💀')
})

// Listen for when we're reconnected
socket.io.on('reconnect', () => {
	console.log('🍽️ Reconnected to the server')
	// Broadcast userJoin event, but only if we were in the chat previously
	if (username) {
		socket.emit('userJoin', username, (success) => {
			addNoticeToChat('You reconnected 🥳', Date.now())
		})
	}
})

// Listen for when the server says hello
socket.on('hello', () => {
	console.log('The nice server said hello 👋')
})

// Listen for new chat messages
socket.on('chatMessage', (message) => {
	console.log('📨 YAY SOMEONE WROTE SOMETHING!!!!!!!', message)

	// print message to chat. boolean: is your it own message?
	addMessageToChat(message)
})

//Listen for a user joining
socket.on('userJoined', (notice) => {
	console.log("We've got company")

	// print to chat that someone joined
	addNoticeToChat(`${notice.username} has joined the chat`, notice.timestamp)
})

// Send a message to the server when form is submitted
messageFormEl.addEventListener('submit', e => {
	e.preventDefault()

	if(!messageEl.value.trim() || !username){
		return
	}

	// Construct message payload
	const message: ChatMessageData = {
		username: username,
		timestamp: Date.now(),
		content: messageEl.value,
	}

	// Send (emit) message to the server
	socket.emit('sendChatMessage', message)

	// print message to chat. boolean: is your it own message?
	addMessageToChat(message, true)

	console.log("Emitted 'sendChatMessage' event to server", message)

	// Clear the input field and focus
	messageEl.value = ''
	messageEl.focus()
})

// Get username from form and then show chat
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault()

	// Get username
	username = (usernameFormEl.querySelector('#username') as HTMLInputElement).value.trim()

	// If no username, NO CHAT FOR YOU
	if (!username) {
		return
	}

	// Emit `userJoin`-event to the server and wait for acknowledgement
	// before showing the chat view
	socket.emit('userJoin', username, (success)=> {
		console.log("Join was success?", success)

		if (!success) {
			alert("NO ACCESS 4 US")
			return
		}

		// Yay we're allowed to join
		showChatView()

	})

	console.log("Emitted 'userJoin' event to server", username)

	// Show chat view
	// showChatView()

})
