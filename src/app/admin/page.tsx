'use client';

import { 
  MdAttachMoney, 
  MdShoppingCart, 
  MdPeople, 
  MdInventory,
  MdTrendingUp,
  MdAssessment,
  MdAdd
} from 'react-icons/md';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import styles from '@/styles/admin/Dashboard.module.css';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Tổng doanh thu',
      value: '₫125,430,000',
      change: '+12.5%',
      trend: 'up',
      icon: <MdAttachMoney />,
      color: '#ff6347'
    },
    {
      label: 'Đơn hàng',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: <MdShoppingCart />,
      color: '#48bb78'
    },
    {
      label: 'Khách hàng',
      value: '856',
      change: '+23.1%',
      trend: 'up',
      icon: <MdPeople />,
      color: '#ed8936'
    },
    {
      label: 'Sản phẩm',
      value: '342',
      change: '+5.4%',
      trend: 'up',
      icon: <MdInventory />,
      color: '#9f7aea'
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Tổng quan về hoạt động kinh doanh"
      action={
        <>
          <Button variant="secondary" size="md" icon={<MdAssessment />}>
            Xuất báo cáo
          </Button>
          <Button variant="primary" size="md" icon={<MdAdd />}>
            Thêm mới
          </Button>
        </>
      }
    >
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={`${styles.statChange} ${styles[stat.trend]}`}>
                  {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <Card title="Doanh thu theo tháng" className={styles.chartCard}>
          <div className={styles.chartPlaceholder}>
            <MdTrendingUp className={styles.chartIcon} />
            <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </Card>

        <Card title="Đơn hàng gần đây" className={styles.chartCard}>
          <div className={styles.ordersList}>
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className={styles.orderItem}>
                <div className={styles.orderIcon}>
                  <MdShoppingCart />
                </div>
                <div className={styles.orderInfo}>
                  <div className={styles.orderTitle}>Đơn hàng #{1000 + order}</div>
                  <div className={styles.orderDate}>2 phút trước</div>
                </div>
                <div className={styles.orderAmount}>₫1,250,000</div>
                <div className={`${styles.orderStatus} ${styles.statusPending}`}>
                  Đang xử lý
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card title="Sản phẩm bán chạy" className={styles.productCard}>
          <div className={styles.productList}>
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className={styles.productItem}>
                <div className={styles.productImage}>
                  <MdInventory />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>Tên sản phẩm {product}</div>
                  <div className={styles.productCategory}>Danh mục A</div>
                </div>
                <div className={styles.productStats}>
                  <div className={styles.productSold}>Đã bán: 245</div>
                  <div className={styles.productRevenue}>₫12,250,000</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Hoạt động gần đây" className={styles.activityCard}>
          <div className={styles.activityList}>
            {[
              { icon: <MdShoppingCart />, text: 'Đơn hàng #1234 đã được xác nhận', time: '5 phút trước' },
              { icon: <MdPeople />, text: 'Khách hàng mới đã đăng ký', time: '10 phút trước' },
              { icon: <MdInventory />, text: 'Sản phẩm mới được thêm vào', time: '15 phút trước' },
              { icon: <MdTrendingUp />, text: 'Đánh giá 5 sao từ khách hàng', time: '30 phút trước' },
            ].map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityInfo}>
                  <div className={styles.activityText}>{activity.text}</div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
