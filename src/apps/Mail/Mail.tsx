import { useState } from 'react';
import './Mail.css';
import { DraftIcon, ImportIcon, ShareIcon, StarIcon, TrashIcon } from '../../assets/icons/Icons';

export const Mail = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    // Implementar envio real do formulário aqui
    alert('Mensagem enviada com sucesso!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="mail-app">
      <div className="mail-sidebar">
        <button className="compose-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6L8 10L14 6M2 6L2 12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V6M2 6L8 2L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          Nova Mensagem
        </button>
        
        <div className="mail-folders">
          <h4>Caixas de Correio</h4>
          <ul>
            <li className="active">
              <span className="folder-icon"><ImportIcon/></span>
              Entrada
              <span className="badge">1</span>
            </li>
            <li>
              <span className="folder-icon"><ShareIcon/></span>
              Enviados
            </li>
            <li>
              <span className="folder-icon"><DraftIcon/></span>
              Rascunhos
            </li>
            <li>
              <span className="folder-icon"><StarIcon/></span>
              Favoritos
            </li>
            <li>
              <span className="folder-icon"><TrashIcon/></span>
              Lixeira
            </li>
          </ul>
        </div>
      </div>

      <div className="mail-content">
        <div className="mail-header">
          <h2>Entre em Contato</h2>
          <p>Vamos conversar sobre seu próximo projeto?</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(31) 99999-9999"
                required
              />
            </div>

          <div className="form-group">
            <label htmlFor="subject">Assunto</label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Qual o motivo do contato?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Conte mais sobre seu projeto ou ideia..."
              required
            />
          </div>

          <button type="submit" className="send-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2L7 9M14 2L9 14L7 9M14 2L2 7L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Enviar Mensagem
          </button>
        </form>

        <div className="contact-info">
          <h3>Outras formas de contato</h3>
          <div className="contact-methods">
            <a href="mailto:rafaelfurtado313@gmail.com" className="contact-method">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6L10 11L17 6M3 6V14C3 14.5523 3.44772 15 4 15H16C16.5523 15 17 14.5523 17 14V6M3 6L10 2L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              rafaelfurtado313@gmail.com
            </a>
            <a href="https://linkedin.com/in/rafael-ildefonso" target="_blank" rel="noopener noreferrer" className="contact-method">
              <svg height="20" width="20" viewBox="0 0 382 382" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z"></path> </g></svg>
              LinkedIn
            </a>
            <a href="https://github.com/rafaelildefonso" target="_blank" rel="noopener noreferrer" className="contact-method">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-1.025-.013-1.862-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
