export default function AdminTestPage() {
  return (
    <div>
      <h1>🎯 TEST: Admin Layout Hoàn Toàn Tách Biệt</h1>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2>✅ Kiểm tra Admin Layout Độc Lập</h2>
        <ul style={{ color: '#4a5568', lineHeight: '1.8' }}>
          <li>🚫 <strong>KHÔNG có Header</strong> của website chính</li>
          <li>🚫 <strong>KHÔNG có Footer</strong> của website chính</li>
          <li>🚫 <strong>KHÔNG có CSS globals.css</strong> từ website chính</li>
          <li>✅ <strong>CÓ AdminSidebar</strong> riêng biệt</li>
          <li>✅ <strong>CÓ CSS reset</strong> riêng cho admin</li>
          <li>✅ <strong>CÓ layout</strong> hoàn toàn độc lập</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{
          background: '#e6fffa',
          border: '2px solid #38b2ac',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#2c7a7b', marginBottom: '1rem' }}>
            🎨 Styling Độc Lập
          </h3>
          <p style={{ color: '#285e61', margin: 0 }}>
            Admin panel sử dụng CSS hoàn toàn riêng biệt, không bị ảnh hưởng bởi 
            styles của website chính.
          </p>
        </div>

        <div style={{
          background: '#fef5e7',
          border: '2px solid #ed8936',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#c05621', marginBottom: '1rem' }}>
            🔒 Route Protection
          </h3>
          <p style={{ color: '#9c4221', margin: 0 }}>
            Middleware bảo vệ tất cả routes /admin/* và chỉ cho phép 
            admin users truy cập.
          </p>
        </div>

        <div style={{
          background: '#f0fff4',
          border: '2px solid #48bb78',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#2f855a', marginBottom: '1rem' }}>
            📱 Responsive Design
          </h3>
          <p style={{ color: '#276749', margin: 0 }}>
            Admin layout responsive hoàn toàn, với mobile menu riêng 
            cho điện thoại và tablet.
          </p>
        </div>
      </div>

      <div style={{
        background: '#f7fafc',
        border: '1px solid #e2e8f0',
        padding: '2rem',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
          🔗 So sánh với Website Chính
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>Website Chính (/)</h4>
            <ul style={{ color: '#718096', fontSize: '0.9rem' }}>
              <li>✅ Header navigation</li>
              <li>✅ Footer links</li>
              <li>✅ Product catalog</li>
              <li>✅ User features</li>
              <li>✅ Shopping cart</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#3182ce', marginBottom: '0.5rem' }}>Admin Panel (/admin)</h4>
            <ul style={{ color: '#718096', fontSize: '0.9rem' }}>
              <li>✅ Admin sidebar</li>
              <li>✅ Dashboard stats</li>
              <li>✅ User management</li>
              <li>✅ Product management</li>
              <li>✅ Order management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
