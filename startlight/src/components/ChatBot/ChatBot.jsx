"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './ChatBot.module.css';

const ChatBot = () => {
  const [OpenChat, setOpenChat] = useState(false);
  const lastMessageRef = useRef(null);

  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minuto = String(fecha.getMinutes()).padStart(2, '0');
  const segundos = String(fecha.getSeconds()).padStart(2, '0');

  const FechaActvidad = `${dia}/${mes}/${anio},${hora}:${minuto}:${segundos}`;

  const FlowiseAI = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://192.168.3.95:3003/api/flowise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: value }),
      });
      const data = await response.json();

      if (data.message === "Unexpected token I in JSON at position 0") {
        setMessage('Actualmente tenemos la Red Caida, Porfavor vuelva luego. Gracias');
      } else {
        setMessage(data.message);
      }

      setPreviousChats(prevChats => ([
        ...prevChats,
        {
          title: currentTitle || value,
          role: "Usuario",
          content: value,
          fecha: FechaActvidad
        },
        {
          title: currentTitle || value,
          role: 'Smart TMT (IA)',
          content: data.message,
          fecha: FechaActvidad
        }
      ]));

      if (!currentTitle) {
        setCurrentTitle(value);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setValue('');
    }
  }

  const enterPressChat = (e) => {
    if (e.key === 'Enter' && value.trim() !== '') {
      e.preventDefault();
      FlowiseAI();
    }
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentChat = previousChats.filter(previousChats => previousChats.title == currentTitle)


  useEffect(() => {
    scrollToBottom();
    const interval = setInterval(() => {
      setFecha(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [message])


  useEffect(() => {
    if (previousChats.length > 0) {
      scrollToBottom();
    }
  }, [previousChats]);

  return (
    <div className={styles.ContainerChatBot}>
      <div className={styles.Container_Icono} onClick={() => setOpenChat(!OpenChat)}>
        {!OpenChat ? (
          <img src='/img/robot_icon.png' alt="Chat Icon" className={styles.IconoChat} />
        ) : (
          <img src='/img/Arrow.svg' alt="Close Icon" className={styles.IconoChatArrow} />
        )}
      </div>

      {OpenChat && (
        <div className={styles.ContenChatBot}>
          <div className={styles.Cabecera_chatbot}>
            <img className={styles.Smart} src='/img/LogoTransparente.png' alt="" />
            <span className={styles.TituloAsistente}>Asistente Virtual IA</span>
          </div>
          <hr />

          <div className={styles.contenidoBoot}>
            <h4 className={styles.MessageBot_Inicial}>
              Hola, soy tu asistente virtual para Aire Portal, tu sistema tributario. ¿Cómo puedo ayudarte?
            </h4>
            {currentChat?.map((chatBot, index) => (
              <React.Fragment key={index}>
                <div className={styles.FechaActividad}>{chatBot.fecha}</div>
                <div
                  className={chatBot.role === 'Usuario' ? styles.contIAUser : styles.contIA}
                  ref={index === currentChat.length - 1 ? lastMessageRef : null}
                >
                  <div className={chatBot.role === 'Smart TMT (IA)' ? styles.ImagenBoot : ''}>
                    {chatBot.role === 'Usuario' ? (
                      <img className={styles.img_chatRoleUsuario} src='/img/Persona.png' alt="" />
                    ) : (
                      <img className={styles.img_chatRoleIA} src='/img/robot.png' alt="" />
                    )}
                  </div>
                  <div
                    className={chatBot.role === 'Usuario' ? styles.MessageBot_Usuario : styles.MessageBot_IA}
                    id="btn"
                  >
                    <div>
                      <span className={styles.RoleBoot}></span>
                      {chatBot.content}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div>
            <div className={styles.AccionesChatBot}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={enterPressChat}
                placeholder="Consulta en Nuestro Portal Tributario"
                className={styles.InputChatBot}
                id="input-text"
              />
              <button type="submit" className={styles.BuscarChatBot} onClick={FlowiseAI} disabled={loading}>
                {loading ? (
                  <div className={styles.Loader}></div>
                ) : (
                  <img src='/img/Buscar.svg' className={styles.imgChatBot} alt="" />
                )}
              </button>
            </div>
            <p className={styles.CreadorBoot}>
              Elaborado por <b><a href="https://smarttmt.com/" target="_blank" rel="noopener noreferrer">Smart TMT</a></b>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;