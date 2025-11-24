// Função para formatar telefone no formato (XX) XXXXX-XXXX
export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = value.replace(/\D/g, '');
  
  // Aplica a formatação
  const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  
  if (match) {
    const result = [];
    if (match[1]) result.push(`(${match[1]}`);
    if (match[2]) result.push(`) ${match[2]}`);
    if (match[3]) result.push(`-${match[3]}`);
    
    return result.join('');
  }
  
  return value;
};

// Função para validar email
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Função para validar telefone (mínimo 10 dígitos, incluindo DDD)
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};
