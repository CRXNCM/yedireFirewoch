import React from 'react';
import './credit-card.css';

const CreditCard = ({ 
  type = "brand-dark", 
  company = "Bank", 
  cardNumber = "**** **** **** ****", 
  bankLogo = null,
  className = ""
}) => {
  return (
    <div className={`credit-card ${type} ${className}`}>
      <div className="credit-card-inner">
        {/* Card Header */}
        <div className="card-header">
          <div className="card-chip">
            <div className="chip"></div>
          </div>
          <div className="card-logo">
            {bankLogo ? (
              <img src={bankLogo} alt={`${company} logo`} className="bank-logo-img" />
            ) : (
              <div className="bank-logo-placeholder">
                {company.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Bank Logo Section */}
        <div className="bank-logo-section">
          {bankLogo ? (
            <img src={bankLogo} alt={`${company} logo`} className="main-bank-logo" />
          ) : (
            <div className="main-bank-logo-placeholder">
              {company.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Card Number */}
        <div className="card-number">
          <span className="number-text">{cardNumber}</span>
        </div>

        {/* Card Footer - Bank Info */}
        <div className="card-footer">
          <div className="bank-info">
            <div className="bank-label">HOLDER NAME</div>
            <div className="bank-name">{company}</div>
          </div>
        </div>

        {/* Card Background Pattern */}
        <div className="card-pattern">
          <div className="pattern-circle circle-1"></div>
          <div className="pattern-circle circle-2"></div>
          <div className="pattern-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
