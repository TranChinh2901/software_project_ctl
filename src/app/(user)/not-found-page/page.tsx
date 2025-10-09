import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: "5px 0px"}}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'not-found' }]} />
      <div style={{width: '100%', display: 'flex', flexDirection: 'column',textAlign: 'center', padding: '2rem  '}}>
        <h1 style={{fontSize: '50px'}}>404</h1>
        <Link style={{color: '#FF6347', marginTop: '15px'}} href="/">Quay lại trang chủ</Link>  
      </div>
    </div>
  );
}
