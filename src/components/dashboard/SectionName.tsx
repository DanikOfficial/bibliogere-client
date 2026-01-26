import React from 'react';

const SectionName: React.FC<{ 
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  withIcon?: string;
  subtitle?: string;
}> = ({ children, align = 'left', withIcon, subtitle }) => {
  
  const getAlignClass = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-end';
      default:
        return 'text-start';
    }
  };

  const alignClass = getAlignClass();

  return (
    <div className={`section-name-wrapper mb-4 ${alignClass}`}>
      {/* Icon and Title Container */}
      <div className="d-flex align-items-center gap-3 mb-2" style={{
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
      }}>
        {withIcon && (
          <div 
            className="section-icon d-inline-flex align-items-center justify-content-center rounded-3"
            style={{
              background: '#007bff',
              width: '48px',
              height: '48px',
              minWidth: '48px',
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)'
            }}
          >
            <i className={`bi ${withIcon} text-white fs-4`}></i>
          </div>
        )}

        {/* Main Title */}
        <h2 
          className="section-title mb-0"
          style={{
            color: '#1a202c',
            fontSize: '1.75rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}
        >
          {children}
        </h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p 
          className="section-subtitle text-muted mb-0"
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.5',
            maxWidth: align === 'center' ? '600px' : '100%',
            marginLeft: align === 'center' ? 'auto' : '0',
            marginRight: align === 'center' ? 'auto' : '0'
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative Line */}
      <div 
        className="section-line mt-3"
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #007bff 0%, transparent 100%)',
          borderRadius: '3px',
          width: align === 'center' ? '80px' : '120px',
          marginLeft: align === 'center' ? 'auto' : '0',
          marginRight: align === 'center' ? 'auto' : align === 'right' ? '0' : 'auto'
        }}
      ></div>

      <style>{`
        .section-name-wrapper {
          position: relative;
        }

        .section-icon {
          transition: all 0.3s ease;
        }

        .section-icon:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3) !important;
        }

        .section-title {
          transition: color 0.3s ease;
        }

        .section-name-wrapper:hover .section-title {
          color: #007bff;
        }

        .section-line {
          transition: all 0.3s ease;
        }

        .section-name-wrapper:hover .section-line {
          width: 140px !important;
        }

        .section-subtitle {
          transition: all 0.3s ease;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 1.5rem !important;
          }
          
          .section-subtitle {
            font-size: 0.9rem !important;
          }
          
          .section-icon {
            width: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
          }

          .section-icon i {
            font-size: 1.2rem !important;
          }
        }

        @media (max-width: 576px) {
          .section-title {
            font-size: 1.3rem !important;
          }

          .section-icon {
            width: 38px !important;
            height: 38px !important;
            min-width: 38px !important;
          }

          .section-icon i {
            font-size: 1.1rem !important;
          }

          .section-line {
            height: 2px !important;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .section-icon,
          .section-title,
          .section-line,
          .section-subtitle {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SectionName;