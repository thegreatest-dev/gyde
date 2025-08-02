import React, { useState } from 'react';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function ForgotPasswordModalWrapper({ show, onClose }) {
  // Optionally, you can add logic here for OTP sent, etc.
  return show ? <ForgotPasswordModal onClose={onClose} /> : null;
}
