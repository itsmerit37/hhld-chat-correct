'use client'
import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";

const ChatBox = () => {
    const [msg, setMsg] = useState('');
    const [msgs, setMsgs] = useState([]); // each message: { text, sender: 'me' | 'other' }
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        newSocket.on('chat msg', incomingMsg => {
            setMsgs(prev => [...prev, { text: incomingMsg, sender: 'other' }]);
        });

        return () => newSocket.close();
    }, []);

    const sendMsg = (e) => {
        e.preventDefault();
        if(socket && msg.trim() !== '') {
            socket.emit('chat msg', msg);
            setMsgs(prev => [...prev, { text: msg, sender: 'me' }]);
            setMsg('');
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msgs]);

    return (
        <div className=" mt-130 bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md ">
            {/* Chat card */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                {/* Messages container */}
                <div className="flex flex-col h-[70vh] overflow-hidden rounded-lg border border-gray-300">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
                        {msgs.map((m, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg w-fit max-w-[80%] 
                                    ${m.sender === 'me' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-300 text-gray-800'}`}
                            >
                                {m.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMsg} className="border-t border-gray-300 p-3 flex items-center gap-1.5 bg-gray-100">
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
