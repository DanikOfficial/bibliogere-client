import React from 'react'

type HeaderProps = {
  name: string
  description: string
}

const Header: React.FC<HeaderProps> = ({ name, description }) => (
  <>
    <div className="header mb-3">
      <h1 className="text-secondary">{name}</h1>
    </div>
    <div className="info mb-2 d-flex flex-column">
      <p className="lead">{description}</p>
    </div>
  </>
)

export default Header
