import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f7fafc',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        color: '#e53e3e', 
        margin: '0 0 1rem 0',
        fontWeight: '700'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '1.5rem', 
        color: '#2d3748', 
        margin: '0 0 1rem 0',
        fontWeight: '600'
      }}>
        Trang không tìm thấy
      </h2>
      <p style={{ 
        fontSize: '1rem', 
        color: '#718096', 
        margin: '0 0 2rem 0',
        maxWidth: '400px'
      }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link 
          href="/" 
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background-color 0.2s ease'
          }}
        >
          🏠 Về trang chủ
        </Link>
        <Link 
          href="/admin" 
          style={{
            backgroundColor: '#38a169',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background-color 0.2s ease'
          }}
        >
          ⚙️ Admin Panel
        </Link>
      </div>
    </div>
  );
}
