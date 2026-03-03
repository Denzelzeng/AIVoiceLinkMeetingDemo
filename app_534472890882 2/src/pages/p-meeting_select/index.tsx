

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

export default function MeetingSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState('张三');
  const [userEmail, setUserEmail] = useState('zhangsan@example.com');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 会议选择';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    // 获取URL参数并更新用户信息
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    
    if (emailParam && nameParam) {
      // 更新用户信息显示
      setUserName(nameParam);
      setUserEmail(emailParam);
      
      // 保存用户信息到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', emailParam);
        localStorage.setItem('userName', nameParam);
      }
    } else {
      // 从localStorage读取用户信息
      if (typeof window !== 'undefined') {
        const savedEmail = localStorage.getItem('userEmail');
        const savedName = localStorage.getItem('userName');
        if (savedEmail && savedName) {
          setUserName(savedName);
          setUserEmail(savedEmail);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // 键盘导航支持
    const handleKeyDown = (e: KeyboardEvent) => {
      const buttons = document.querySelectorAll('[data-action-button]');
      const currentIndex = Array.from(buttons).findIndex(btn => btn === document.activeElement);
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        buttons[currentIndex - 1].focus();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && currentIndex < buttons.length - 1) {
        buttons[currentIndex + 1].focus();
        e.preventDefault();
      } else if (e.key === 'Enter' && document.activeElement?.tagName === 'BUTTON') {
        (document.activeElement as HTMLButtonElement).click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCreateMeeting = () => {
    navigate('/create-meeting');
  };

  const handleJoinMeeting = () => {
    navigate('/join-meeting');
  };

  const handleMeetingRecord = () => {
    navigate('/meeting-record');
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // 清除localStorage中的用户信息
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
      }
      // 跳转到登录页面
      navigate('/login');
    }
  };

  const handleButtonFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
  };

  const handleButtonBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-language text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold text-text-primary">译会通</h1>
          </div>
          
          {/* 用户信息和退出按钮 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{userName}</div>
                <div className="text-xs text-text-secondary">{userEmail}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className={`px-4 py-2 text-text-secondary hover:text-danger rounded-lg transition-colors ${styles.navItemHover}`}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>退出
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className={`${styles.mainContent} pt-16 flex items-center justify-center`}>
        <div className="w-full max-w-2xl mx-auto px-6 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">请选择操作</h2>
            <p className="text-lg text-white/80">选择您要进行的会议操作</p>
          </div>

          {/* 功能按钮组 */}
          <div className="space-y-6 max-w-md mx-auto">
            {/* 开设会议按钮 */}
            <button 
              data-action-button
              onClick={handleCreateMeeting}
              onFocus={handleButtonFocus}
              onBlur={handleButtonBlur}
              className={`w-full h-16 bg-white text-primary border-2 border-primary rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-button ${styles.buttonHover}`}
            >
              <i className="fas fa-plus-circle text-2xl"></i>
              <span>开设会议</span>
            </button>

            {/* 加入会议按钮 */}
            <button 
              data-action-button
              onClick={handleJoinMeeting}
              onFocus={handleButtonFocus}
              onBlur={handleButtonBlur}
              className={`w-full h-16 bg-white text-success border-2 border-success rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-button ${styles.buttonHover}`}
            >
              <i className="fas fa-sign-in-alt text-2xl"></i>
              <span>加入会议</span>
            </button>

            {/* 会议记录按钮 */}
            <button 
              data-action-button
              onClick={handleMeetingRecord}
              onFocus={handleButtonFocus}
              onBlur={handleButtonBlur}
              className={`w-full h-16 bg-white text-info border-2 border-info rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-button ${styles.buttonHover}`}
            >
              <i className="fas fa-history text-2xl"></i>
              <span>会议记录</span>
            </button>
          </div>

          {/* 功能说明卡片 */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <i className="fas fa-info-circle text-info mr-2"></i>
                功能说明
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-plus-circle text-primary text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-2">开设会议</h4>
                  <p className="text-text-secondary">创建新的会议房间，作为房主开始实时翻译服务</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-sign-in-alt text-success text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-2">加入会议</h4>
                  <p className="text-text-secondary">输入房间号码，加入现有会议接收翻译内容</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-history text-info text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-2">会议记录</h4>
                  <p className="text-text-secondary">查看历史会议的翻译记录和时间信息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

