'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdDarkMode, MdLightMode, MdPowerSettingsNew } from 'react-icons/md';
import styles from '@/styles/admin/Settings.module.css';
import toast from 'react-hot-toast';

export default function Settings() {
  const router = useRouter();
  const [autoSleep, setAutoSleep] = useState(false);
  const [sleepTimer, setSleepTimer] = useState('30');
  const [isSaving, setIsSaving] = useState(false);
  const [showSleepOverlay, setShowSleepOverlay] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedAutoSleep = localStorage.getItem('autoSleep') === 'true';
    const savedSleepTimer = localStorage.getItem('sleepTimer') || '30';
    
    setAutoSleep(savedAutoSleep);
    setSleepTimer(savedSleepTimer);
  }, []);
  useEffect(() => {
    if (!autoSleep || showSleepOverlay) {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
      return;
    }
    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      const timer = setTimeout(() => {
        setShowSleepOverlay(true);
      }, parseInt(sleepTimer) * 60 * 1000);
      setInactivityTimer(timer);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [autoSleep, sleepTimer, showSleepOverlay]);

  const handleSleepModeToggle = () => {
    setShowSleepOverlay(true);
    toast.success('Đã bật chế độ Sleep Mode');
  };
  const handleWakeUp = () => {
    setShowSleepOverlay(false);
   
    toast.success('Đã thoát chế độ Sleep Mode');
  };
  const handleAutoSleepToggle = () => {
    const newValue = !autoSleep;
    setAutoSleep(newValue);
    
    if (newValue) {
      toast.success('Đã bật Tự động Sleep Mode');
    } else {
      toast.success('Đã tắt Tự động Sleep Mode');
    }
  };
  const handleSleepTimerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimer = e.target.value;
    setSleepTimer(newTimer);
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('autoSleep', autoSleep.toString());
    localStorage.setItem('sleepTimer', sleepTimer);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Đã lưu cài đặt thành công!');
    }, 500);
  };

  const handleReset = () => {
    setAutoSleep(false);
    setSleepTimer('30');
    setShowSleepOverlay(false);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
    toast.success('Đã reset về cài đặt mặc định');
  };

  return (
    <>
      {showSleepOverlay && (
        <div className={styles.sleepOverlay}>
          <div className={styles.sleepContent}>
            <MdPowerSettingsNew className={styles.sleepIcon} />
            <h2 className={styles.sleepTitle}>Chế độ Sleep Mode</h2>
            <p className={styles.sleepDescription}>
              Màn hình đang ở chế độ nghỉ để tiết kiệm năng lượng
            </p>
            <button 
              className={styles.wakeUpButton}
              onClick={handleWakeUp}
            >
              <MdPowerSettingsNew />
              <span>Hoạt động lại</span>
            </button>
          </div>
        </div>
      )}

      <div className={styles.settingsContainer}>
        <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
        >
          <MdArrowBack />
          <span>Quay lại</span>
        </button>
        <h1 className={styles.title}>Cài đặt</h1>
      </div>
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderIcon}>
            {showSleepOverlay ? <MdDarkMode /> : <MdLightMode />}
          </div>
          <div>
            <h2 className={styles.cardTitle}>Sleep Mode</h2>
            <p className={styles.cardDescription}>
              Chế độ tiết kiệm năng lượng - tắt màn hình ngay lập tức
            </p>
          </div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3 className={styles.settingLabel}>Bật Sleep Mode ngay</h3>
              <p className={styles.settingDescription}>
                Click để chuyển ngay sang chế độ sleep - màn hình sẽ tối hoàn toàn
              </p>
            </div>
            <button 
              className={styles.sleepButton}
              onClick={handleSleepModeToggle}
            >
              <MdPowerSettingsNew />
              <span>Sleep ngay</span>
            </button>
          </div>
          
          <div className={styles.dividerLine}></div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3 className={styles.settingLabel}>Tự động Sleep Mode</h3>
              <p className={styles.settingDescription}>
                Tự động bật Sleep Mode sau khoảng thời gian không hoạt động
              </p>
            </div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={autoSleep}
                onChange={handleAutoSleepToggle}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {autoSleep && (
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <h3 className={styles.settingLabel}>Thời gian chờ</h3>
                <p className={styles.settingDescription}>
                  Chọn thời gian không hoạt động trước khi tự động bật Sleep Mode
                </p>
              </div>
              <select 
                className={styles.selectInput}
                value={sleepTimer}
                onChange={handleSleepTimerChange}
              >
                <option value="1">1 phút</option>
                <option value="5">5 phút</option>
                <option value="10">10 phút</option>
                <option value="20">20 phút</option>
                <option value="30">30 phút</option>
                <option value="60">1 giờ</option>
              </select>
            </div>
          )}

          {autoSleep && (
            <div className={styles.infoBox}>
              <h4 className={styles.infoTitle}>Tự động Sleep Mode đang bật</h4>
              <ul className={styles.infoList}>
                <li>Hệ thống sẽ tự động sleep sau <strong>{sleepTimer} phút</strong> không hoạt động</li>
                <li>Hoạt động được tính: di chuyển chuột, nhấn phím, scroll, touch</li>
                <li>Màn hình sẽ tối hoàn toàn khi tự động kích hoạt</li>
                <li>Click "Hoạt động lại" để thoát khỏi sleep mode</li>
              </ul>
            </div>
          )}
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.buttonSecondary}
            onClick={handleReset}
          >
            Reset về mặc định
          </button>
          <button 
            className={styles.buttonPrimary}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderIcon}>
            <MdLightMode />
          </div>
          <div>
            <h2 className={styles.cardTitle}>Cài đặt khác</h2>
            <p className={styles.cardDescription}>
              Các tùy chọn cài đặt bổ sung
            </p>
          </div>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.comingSoon}>Đang phát triển...</p>
        </div>
      </div>
    </div>
    </>
  );
}
