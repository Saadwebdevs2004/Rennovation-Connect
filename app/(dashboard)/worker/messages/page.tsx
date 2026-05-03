"use client"

import { useState, useEffect } from "react"
import { Send, User, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export default function WorkerMessages() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const userId = currentUser?.id || currentUser?.UserID

  // SWR for contacts list
  const { data: contactsData, mutate: mutateContacts } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/messages/conversations/${userId}`)}` : null,
    fetcher,
    { refreshInterval: 3000 }
  )

  const contacts = Array.isArray(contactsData) ? contactsData.map((c: any) => ({
    id: c.contact_id,
    name: c.contact_name,
    lastMessage: c.last_message || "Click to chat",
    ...c
  })) : []

  // SWR for messages in selected conversation
  const { data: messagesData } = useSWR(
    userId && selectedContact ? `/api/proxy?path=${encodeURIComponent(`/api/messages/${userId}/${selectedContact.id}`)}` : null,
    fetcher,
    { refreshInterval: 3000 }
  )

  const messages = Array.isArray(messagesData) ? messagesData : []

  // Handle new conversation from URL (if applicable)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const contactId = params.get('contactId')
      const name = params.get('name') || "Client"
      const jobId = params.get('jobId')
      
      if (contactId && !selectedContact) {
        // Find in existing contacts first
        const found = contacts.find((c: any) => String(c.id) === String(contactId))
        
        if (found) {
          setSelectedContact(found)
        } else if (contactsData !== undefined) {
          // If not found in existing contacts, but contacts have finished loading, create a temporary contact
          setSelectedContact({
            id: contactId,
            name: decodeURIComponent(name),
            job_id: jobId,
            lastMessage: "Start a new conversation",
            unread_count: 0
          })
        }
        
        // Only clear the URL once we've selected the contact
        if (found || contactsData !== undefined) {
          window.history.replaceState({}, '', window.location.pathname)
        }
      }
    }
  }, [contacts, contactsData, selectedContact])

  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact)
    if (userId) {
      // Mark as read
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/messages/read/${userId}/${contact.id}`)}`, { method: 'PUT' })
        .then(() => mutateContacts())
        .catch(err => console.error("Failed to mark as read:", err))
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedContact || !userId) return

    const receiverId = selectedContact.id
    const content = newMessage
    setNewMessage("")

    try {
      const res = await fetch('/api/proxy?path=%2Fapi%2Fmessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: receiverId,
          job_id: selectedContact.job_id || null,
          content: content
        })
      })
      
      if (res.ok) {
        // Immediate local update
        mutate(`/api/proxy?path=${encodeURIComponent(`/api/messages/${userId}/${receiverId}`)}`)
        mutateContacts()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const myId = currentUser?.id || currentUser?.UserID

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[80vh]">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Chat with homeowners about their projects.</p>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border flex overflow-hidden">
        
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-border overflow-y-auto bg-muted/20">
          <div className="p-4 border-b border-border font-semibold">Conversations</div>
          <div className="p-2 space-y-1">
            {!myId && (
              <div className="p-8 text-center text-destructive text-sm">
                User authentication missing. Please try logging out and back in.
              </div>
            )}
            {myId && contacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No active conversations.
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative ${selectedContact?.id === contact.id ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left overflow-hidden flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{contact.name}</p>
                      {contact.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold animate-in zoom-in duration-300">
                          {contact.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage || 'Click to chat'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-semibold">{selectedContact.name}</h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isMe = String(msg.sender_id) === String(myId)
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className={`p-3 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                        {!isMe && <p className="text-xs font-medium mb-1 opacity-70">{selectedContact.name}</p>}
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-[10px] mt-1 opacity-70 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p>Send a message to start the conversation.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
            <p>Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
