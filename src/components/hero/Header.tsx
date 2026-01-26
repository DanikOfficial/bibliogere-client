import React from 'react'

type HeaderProps = {
  name: string
  description: string
}

const Header: React.FC<HeaderProps> = ({ name, description }) => (
  <div className="header-section">
    <h2 className="text-primary text-center fw-light mb-2">{name}</h2>
    <p className="text-muted text-center mb-0" style={{ fontSize: '0.95rem' }}>
      {description}
    </p>
  </div>
)

export default Header