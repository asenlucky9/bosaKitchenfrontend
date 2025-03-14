class ChatSystem {
    constructor(orderId, userId, riderName) {
        this.orderId = orderId;
        this.userId = userId;
        this.riderName = riderName;
        this.messages = [];
        this.unreadCount = 0;
        this.chatWindow = null;
        this.init();
    }

    init() {
        this.createChatUI();
        this.loadMessages();
        this.setupEventListeners();
    }

    createChatUI() {
        const chatHTML = `
            <div class="chat-container" id="chat-container">
                <div class="chat-header">
                    <h3>Chat with ${this.riderName}</h3>
                    <button class="minimize-btn" id="minimize-chat">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" id="message-input" placeholder="Type a message...">
                    <button id="send-message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        const chatStyles = `
            <style>
                .chat-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    height: 400px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                }

                .chat-header {
                    padding: 1rem;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .minimize-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }

                .chat-messages {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .message {
                    max-width: 80%;
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                    margin: 0.2rem 0;
                }

                .message.sent {
                    background: var(--primary-color);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 0.2rem;
                }

                .message.received {
                    background: var(--light-bg);
                    color: var(--text-color);
                    align-self: flex-start;
                    border-bottom-left-radius: 0.2rem;
                }

                .chat-input {
                    padding: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    border-top: 1px solid #eee;
                }

                .chat-input input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    outline: none;
                }

                .chat-input button {
                    padding: 0.5rem 1rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .chat-input button:hover {
                    background: var(--secondary-color);
                }

                .message-time {
                    font-size: 0.8rem;
                    opacity: 0.7;
                    margin-top: 0.2rem;
                }

                .unread-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--error);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                }
            </style>
        `;

        const container = document.createElement('div');
        container.innerHTML = chatHTML + chatStyles;
        document.body.appendChild(container);

        this.chatWindow = document.getElementById('chat-container');
    }

    setupEventListeners() {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message');
        const minimizeBtn = document.getElementById('minimize-chat');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        minimizeBtn.addEventListener('click', () => this.toggleChat());
    }

    async loadMessages() {
        // Load messages from localStorage (replace with API call in production)
        const stored = localStorage.getItem(`chat_${this.orderId}`);
        if (stored) {
            this.messages = JSON.parse(stored);
            this.displayMessages();
        }
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (!message) return;

        const newMessage = {
            id: Date.now(),
            text: message,
            sender: this.userId,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        this.messages.push(newMessage);
        this.saveMessages();
        this.displayMessages();
        input.value = '';

        // Simulate rider response (replace with actual API integration)
        setTimeout(() => this.simulateRiderResponse(), 2000);
    }

    simulateRiderResponse() {
        const responses = [
            "I'm on my way!",
            "I'll be there in a few minutes.",
            "Just picked up your order.",
            "Almost at your location.",
            "Got stuck in traffic, but moving now."
        ];

        const response = {
            id: Date.now(),
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: 'rider',
            timestamp: new Date().toISOString(),
            status: 'received'
        };

        this.messages.push(response);
        this.saveMessages();
        this.displayMessages();
        this.incrementUnread();
    }

    displayMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';

        this.messages.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${message.sender === this.userId ? 'sent' : 'received'}`;
            
            const time = new Date(message.timestamp).toLocaleTimeString();
            messageEl.innerHTML = `
                ${message.text}
                <div class="message-time">${time}</div>
            `;

            container.appendChild(messageEl);
        });

        container.scrollTop = container.scrollHeight;
    }

    saveMessages() {
        localStorage.setItem(`chat_${this.orderId}`, JSON.stringify(this.messages));
    }

    toggleChat() {
        const messages = document.getElementById('chat-messages');
        const input = document.getElementById('chat-input');
        
        if (messages.style.display === 'none') {
            messages.style.display = 'flex';
            input.style.display = 'flex';
            this.chatWindow.style.height = '400px';
            this.resetUnread();
        } else {
            messages.style.display = 'none';
            input.style.display = 'none';
            this.chatWindow.style.height = 'auto';
        }
    }

    incrementUnread() {
        this.unreadCount++;
        this.updateUnreadBadge();
    }

    resetUnread() {
        this.unreadCount = 0;
        this.updateUnreadBadge();
    }

    updateUnreadBadge() {
        let badge = document.querySelector('.unread-badge');
        if (this.unreadCount > 0) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'unread-badge';
                document.querySelector('.chat-header').appendChild(badge);
            }
            badge.textContent = this.unreadCount;
        } else if (badge) {
            badge.remove();
        }
    }
} 