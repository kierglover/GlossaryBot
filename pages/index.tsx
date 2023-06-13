import { useState, useRef, useEffect, useMemo } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import remarkGfm from "remark-gfm";

type Message = {
  type: "apiMessage" | "userMessage";
  message: string;
  isStreaming?: boolean;
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{ messages: Message[], pending?: string, history: [string, string][] }>({
    messages: [{
      "message": "Hi, I'm the Mäd AI assistant. How can I help?",
      "type": "apiMessage"
    }],
    history: []
  });
  const { messages, pending, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [pending]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus();
  }, [loading]);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const question = userInput.trim();
    if (question === "") {
      return;
    }

    setMessageState(state => ({
      ...state,
      messages: [...state.messages, {
        type: "userMessage",
        message: question
      }],
      pending: undefined
    }));

    setLoading(true);
    setUserInput("");
    setMessageState(state => ({ ...state, pending: "" }));

    const ctrl = new AbortController();

    fetchEventSource('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === "[DONE]") {
          setMessageState(state => (  {
            history: [...state.history, [question, state.pending ?? ""]],
            messages: [...state.messages, {
              type: "apiMessage",
              message: state.pending ?? "",
            }],
            pending: undefined
          }));
          setLoading(false);
          ctrl.abort();
        } else {
          const data = JSON.parse(event.data);
          setMessageState(state => ({
            ...state,
            pending: (state.pending ?? "") + data.data,
          }));
        }
      }
    });
  }

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if(!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [...messages, ...(pending ? [{ type: "apiMessage", message: pending }] : [])];
  }, [messages, pending]);

  return (
    <>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>Mäd AI Assistant</title>
        <meta name="title" content="Mäd AI Assistant" />
        <meta name="description" content="Powered by AI, the Mäd chatbot assistent allows more effective inisghts in a quick, easy and conversational way." />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mäd AI Assistant"/>
        <meta property="og:description" content="Powered by AI, the UNDP policy assist chatbot allows more effective inisghts in a quick, easy and conversational way." />
        <meta property="og:image" content="https://undp-policy-assist.fly.dev/og-image.svg" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Mäd AI Assistant" />
        <meta property="twitter:description" content="Powered by AI, the UNDP policy assist chatbot allows more effective inisghts in a quick, easy and conversational way." />
        <meta property="twitter:image" content="https://undp-policy-assist.fly.dev/og-image.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
        <div>
          <Link href="https://ai.mad.co"><Image src="/MadLogoWhite.svg" alt="logo" className={styles.navlogo} priority></Image></Link>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.cloudLeft}>
          <div className={styles.cloudLeftContent}>
            <div className={styles.cloudLeftTitle}>
              <p className={styles.paraEmoji}>🤔</p>
              <p className={styles.paraStrong}>What is the Mäd AI assistant?</p>
            </div>
            <p className={styles.paraLight}>The Mäd chatbot leverages the power of OpenAI to understand your questions and provide responses based on our online library of over 175 insights.</p>
          </div>
          <div className={styles.cloudLeftContent}>
            <div className={styles.cloudLeftTitle}>
              <p className={styles.paraEmoji}>🤓</p>
              <p className={styles.paraStrong}>How and why this matters</p>
            </div>
            <p className={styles.paraLight}>We combined all our insights into a dataset which can then be provided to the AI. Following this, we create a context for the AI so it knows how to interprit this data and respond effectively.</p>
            <br></br>
            <p className={styles.paraLight}>The Mäd AI assistant acts as both a unique way to interact with our insights, but also as a proof of concept that has already peaked the interest of some of our clients and partners such as the UNDP, financial and legal firms.</p>
          </div>
          <div className={styles.cloudLeftContent}>
            <div className={styles.cloudLeftTitle}>
              <p className={styles.paraEmoji}>💡</p>
              <p className={styles.paraStrong}>Tips for writing better prompts</p>
            </div>
              <li className={styles.paraLight}>Use a thesaurus, finding the right word or phrasing can unlock what you're doing.</li>
              <br></br>
              <li className={styles.paraLight}>Pay attention to your verbs, make sure your prompt includes a verb that clearly expresses your intent.</li>
              <br></br>
              <li className={styles.paraLight}> Clarify your intent, introduce what you're trying to do clearly from the beginning, and play around with wording, tense, and approach.</li>
          </div>
        </div>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {chatMessages.map((message, index) => {
              let icon;
              let className;

              if (message.type === "apiMessage") {
                icon = <Image src="/chatIcon.png" alt="AI" width="32" height="32" className={styles.boticon} priority />;
                className = styles.apimessage;
              } else {
                icon = <Image src="/userIcon.png" alt="Me" width="30" height="30" className={styles.usericon} priority />

                // The latest message sent by the user will be animated while waiting for a response
                className = loading && index === chatMessages.length - 1
                  ? styles.usermessagewaiting
                  : styles.usermessage;
              }
              return (
                <div className={styles.chatMessageWrap}>
                  {icon}
                  <div key={index} className={className}>
                    <div className={styles.markdownanswer}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        linkTarget="_blank"
                      >
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea 
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput" 
                name="userInput" 
                placeholder={loading? "Waiting for response..." : "Type your question..."}  
                value={userInput} 
                onChange={e => setUserInput(e.target.value)} 
                className={styles.textarea}
              />
              <button 
                type="submit" 
                disabled = {loading}
                className = {styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20}/>
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg viewBox='0 0 20 20' className={styles.svgicon} xmlns='http://www.w3.org/2000/svg'>
                    <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
        </div>
      </main>
    </>
  )
}
