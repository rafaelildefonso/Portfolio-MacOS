import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Mail.css';
import { DraftIcon, ImportIcon, ShareIcon, StarIcon, TrashIcon } from '../../assets/icons/Icons';
import { formatPhoneNumber, validateEmail, validatePhone } from '../../utils/formatters';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const Mail = () => {
  const { t } = useTranslation();
  const mailT = t('mail', { returnObjects: true }) as any;
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = `${mailT.form.name} ${mailT.form.validation.required}`;
    }
    
    if (!formData.email) {
      newErrors.email = `${mailT.form.email} ${mailT.form.validation.required}`;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = mailT.form.validation.email;
    }
    
    if (!formData.phone) {
      newErrors.phone = `${mailT.form.phone} ${mailT.form.validation.required}`;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = mailT.form.validation.phone;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = `${mailT.form.subject} ${mailT.form.validation.required}`;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = `${mailT.form.message} ${mailT.form.validation.required}`;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = mailT.form.validation.messageMinLength;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulando envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Formulário enviado:', formData);
      
      // Limpa o formulário após o envio
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert(mailT.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mail-app">
      <div className="mail-sidebar">
        <button className="compose-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6L8 10L14 6M2 6L2 12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V6M2 6L8 2L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          {mailT.compose}
        </button>
        
        <div className="mail-folders">
          <h4>{mailT.mailboxes}</h4>
          <ul>
            <li className="active">
              <span className="folder-icon"><ImportIcon/></span>
              {mailT.inbox}
              <span className="badge">1</span>
            </li>
            <li>
              <span className="folder-icon"><ShareIcon/></span>
              {mailT.sent}
            </li>
            <li>
              <span className="folder-icon"><DraftIcon/></span>
              {mailT.drafts}
            </li>
            <li>
              <span className="folder-icon"><StarIcon/></span>
              {mailT.favorites}
            </li>
            <li>
              <span className="folder-icon"><TrashIcon/></span>
              {mailT.trash}
            </li>
          </ul>
        </div>
      </div>

      <div className="mail-content">
        <div className="mail-header">
          <h2>{mailT.contactTitle}</h2>
          <p>{mailT.contactSubtitle}</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{mailT.form.name}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.name.trim()) {
                    setErrors(prev => ({ ...prev, name: `${mailT.form.name} ${mailT.form.validation.required}` }));
                  }
                }}
                placeholder={mailT.form.namePlaceholder}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">{mailT.form.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.email) {
                    setErrors(prev => ({ ...prev, email: `${mailT.form.email} ${mailT.form.validation.required}` }));
                  } else if (!validateEmail(formData.email)) {
                    setErrors(prev => ({ ...prev, email: mailT.form.validation.email }));
                  }
                }}
                placeholder={mailT.form.emailPlaceholder}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{mailT.form.phone}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.phone) {
                    setErrors(prev => ({ ...prev, phone: `${mailT.form.phone} ${mailT.form.validation.required}` }));
                  } else if (!validatePhone(formData.phone)) {
                    setErrors(prev => ({ ...prev, phone: mailT.form.validation.phone }));
                  }
                }}
                placeholder={mailT.form.phonePlaceholder}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

          <div className="form-group">
            <label htmlFor="subject">{mailT.form.subject}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={() => {
                if (!formData.subject.trim()) {
                  setErrors(prev => ({ ...prev, subject: `${mailT.form.subject} ${mailT.form.validation.required}` }));
                }
              }}
              placeholder={mailT.form.subjectPlaceholder}
              className={errors.subject ? 'input-error' : ''}
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">{mailT.form.message}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={() => {
                if (!formData.message.trim()) {
                  setErrors(prev => ({ ...prev, message: `${mailT.form.message} ${mailT.form.validation.required}` }));
                } else if (formData.message.trim().length < 10) {
                  setErrors(prev => ({ ...prev, message: mailT.form.validation.messageMinLength }));
                }
              }}
              placeholder={mailT.form.messagePlaceholder}
              rows={5}
              className={errors.message ? 'input-error' : ''}
            ></textarea>
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <div className="form-footer">
            <button 
              type="submit" 
              className={`send-btn ${isSubmitting ? 'sending' : ''} ${submitSuccess ? 'success' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {mailT.form.sending}
                </button>
              ) : submitSuccess ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Mensagem Enviada!
                </>
              ) : (
                <button type="submit" className="submit-btn">
                  {mailT.form.submit}
                </button>
              )}
            </button>
            {submitSuccess && (
              <div className="success-message">
                {mailT.form.success}
              </div>
            )}
          </div>
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
              <svg height="20" width="20" viewBox="0 0 382 382" fill="currentColor"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z"></path> </g></svg>
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
