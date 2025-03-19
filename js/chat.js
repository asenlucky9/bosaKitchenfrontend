class ChatSystem {
    constructor(orderId, userId, riderName) {
        this.orderId = orderId;
        this.userId = userId;
        this.riderName = riderName;
        this.messages = [];
        this.unreadCount = 0;
        this.chatWindow = null;
        this.isMinimized = false;
        this.lastTyping = 0;
        this.orderStatus = 'pending';
        this.init();
    }

    init() {
        this.createChatUI();
        this.loadMessages();
        this.setupEventListeners();
        this.startOrderUpdates();
    }

    createChatUI() {
        const chatHTML = `
            <div class="chat-container" id="chat-container">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <h3>Chat with ${this.riderName}</h3>
                        <span class="order-info">Order #${this.orderId}</span>
                    </div>
                    <div class="chat-controls">
                        <button class="minimize-btn" id="minimize-chat">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div class="chat-status">
                    <div class="typing-indicator" style="display: none;">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="quick-responses" id="quick-responses">
                    <button class="quick-response-btn">Where is my order?</button>
                    <button class="quick-response-btn">Need help</button>
                    <button class="quick-response-btn">Change delivery address</button>
                </div>
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
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .chat-container.minimized {
                    height: 60px;
                    overflow: hidden;
                }

                .chat-header {
                    padding: 1rem;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-header-info {
                    display: flex;
                    flex-direction: column;
                }

                .order-info {
                    font-size: 0.8rem;
                    opacity: 0.8;
                }

                .chat-status {
                    padding: 0.5rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                }

                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 0.5rem;
                    justify-content: flex-start;
                }

                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    background: var(--secondary-color);
                    border-radius: 50%;
                    animation: typing 1s infinite;
                }

                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .quick-responses {
                    padding: 0.5rem;
                    display: flex;
                    gap: 0.5rem;
                    overflow-x: auto;
                    background: #f8f9fa;
                }

                .quick-response-btn {
                    padding: 0.5rem 1rem;
                    background: var(--light-bg);
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .quick-response-btn:hover {
                    background: var(--secondary-color);
                    color: white;
                }

                .message {
                    max-width: 80%;
                    padding: 0.8rem 1rem;
                    border-radius: 1rem;
                    margin: 0.5rem 0;
                    position: relative;
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

                .message.system {
                    background: #e9ecef;
                    color: #495057;
                    align-self: center;
                    font-size: 0.9rem;
                    border-radius: 0.5rem;
                }

                .message-status {
                    font-size: 0.7rem;
                    margin-top: 0.2rem;
                    text-align: right;
                }

                .message-time {
                    font-size: 0.8rem;
                    opacity: 0.7;
                    margin-top: 0.2rem;
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
        const quickResponses = document.querySelectorAll('.quick-response-btn');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        minimizeBtn.addEventListener('click', () => this.toggleChat());

        quickResponses.forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.textContent;
                this.sendMessage();
            });
        });

        // Show typing indicator when user is typing
        input.addEventListener('input', () => {
            this.lastTyping = Date.now();
            this.showTypingIndicator();
        });
    }

    showTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        indicator.style.display = 'flex';
        
        setTimeout(() => {
            if (Date.now() - this.lastTyping >= 1000) {
                indicator.style.display = 'none';
            }
        }, 1500);
    }

    addSystemMessage(text) {
        const message = {
            id: Date.now(),
            text: text,
            type: 'system',
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.saveMessages();
        this.displayMessages();
    }

    startOrderUpdates() {
        // Simulate order status updates
        const statuses = ['preparing', 'ready', 'picked_up', 'on_way', 'delivered'];
        let currentIndex = 0;

        const updateInterval = setInterval(() => {
            if (currentIndex < statuses.length) {
                this.orderStatus = statuses[currentIndex];
                this.addSystemMessage(`Order status updated to: ${this.orderStatus}`);
                currentIndex++;
            } else {
                clearInterval(updateInterval);
            }
        }, 30000); // Update every 30 seconds
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