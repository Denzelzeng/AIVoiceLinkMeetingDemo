

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const JoinMeetingPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('请输入四位数房间号码');
  const roomNumberInputRef = useRef<HTMLInputElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 加入会议';
    return () => { document.title = originalTitle; };
  }, []);

  // 页面加载时聚焦到输入框
  useEffect(() => {
    if (roomNumberInputRef.current) {
      roomNumberInputRef.current.focus();
    }
  }, []);

  // 房间号输入验证
  const validateRoomNumber = (value: string): boolean => {
    // 清除之前的错误状态
    clearError();
    
    if (!value || value.length === 0) {
      showErrorMessage('请输入房间号码');
      return false;
    }
    
    if (value.length !== 4) {
      showErrorMessage('房间号码必须为四位数');
      return false;
    }
    
    if (!/^\d{4}$/.test(value)) {
      showErrorMessage('房间号码只能包含数字');
      return false;
    }
    
    return true;
  };

  // 显示错误信息
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  // 清除错误信息
  const clearError = () => {
    setShowError(false);
  };

  // 房间号输入事件处理
  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 只允许输入数字
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRoomNumber(value);
    
    // 实时验证
    if (value.length === 4) {
      validateRoomNumber(value);
    } else {
      clearError();
    }
  };

  // 表单提交事件
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedRoomNumber = roomNumber.trim();
    
    if (!validateRoomNumber(trimmedRoomNumber)) {
      return;
    }
    
    // 设置加载状态
    setIsLoading(true);
    
    // 模拟房间号验证和连接过程
    setTimeout(() => {
      // 这里应该是实际的房间号验证逻辑
      // 为了演示，我们假设所有四位数房间号都是有效的
      console.log('加入会议，房间号：', trimmedRoomNumber);
      
      // 跳转到会议进行页面，传递房间号和用户角色
      navigate(`/meeting-room?roomNumber=${trimmedRoomNumber}&role=participant`);
    }, 1500);
  };

  // 返回按钮点击事件
  const handleBackClick = () => {
    navigate(-1);
  };

  // 退出按钮点击事件
  const handleLogoutClick = () => {
    if (confirm('确定要退出登录吗？')) {
      // 清除会话信息
      navigate('/login');
    }
  };

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      
      if (e.key === 'Escape') {
        // ESC键返回上一页
        navigate(-1);
      } else if (e.key === 'Enter' && activeElement?.tagName !== 'BUTTON') {
        // Enter键提交表单（如果当前焦点不在按钮上）
        if (roomNumber.length === 4) {
          const form = document.getElementById('join-meeting-form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, roomNumber]);

  // 按钮焦点效果
  const handleButtonFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.id !== 'back-btn') {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
    }
  };

  const handleButtonBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.id !== 'back-btn') {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
    }
  };

  // 输入框焦点效果
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select(); // 全选文本
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
                <div className="text-sm font-medium text-text-primary">张三</div>
                <div className="text-xs text-text-secondary">zhangsan@example.com</div>
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              onFocus={handleButtonFocus}
              onBlur={handleButtonBlur}
              className={`px-4 py-2 text-text-secondary hover:text-danger ${styles.navItemHover} rounded-lg transition-colors`}
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
            <h2 className="text-3xl font-bold text-white mb-4">加入会议</h2>
            <p className="text-lg text-white/80">输入四位数房间号码加入会议</p>
          </div>

          {/* 加入会议表单 */}
          <div className="max-w-md mx-auto">
            <div className={`${styles.glassEffect} rounded-2xl p-8 shadow-card`}>
              <form id="join-meeting-form" onSubmit={handleFormSubmit} className="space-y-6">
                {/* 房间号输入 */}
                <div className="space-y-2">
                  <label htmlFor="room-number" className="block text-sm font-medium text-text-primary">
                    <i className="fas fa-key text-primary mr-2"></i>
                    房间号码
                  </label>
                  <div className="relative">
                    <input 
                      ref={roomNumberInputRef}
                      type="text" 
                      id="room-number" 
                      name="room-number" 
                      value={roomNumber}
                      onChange={handleRoomNumberChange}
                      onFocus={handleInputFocus}
                      className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} text-center text-2xl font-mono tracking-widest ${showError ? styles.inputError : ''}`}
                      placeholder="0000"
                      maxLength={4}
                      autoComplete="off"
                      required
                    />
                    <div className={`absolute -bottom-6 left-0 text-sm text-danger ${showError ? '' : 'hidden'}`}>
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                </div>

                {/* 加入按钮 */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  onFocus={handleButtonFocus}
                  onBlur={handleButtonBlur}
                  className={`w-full h-12 bg-success text-white rounded-xl font-semibold text-lg ${styles.buttonHover} flex items-center justify-center space-x-3 shadow-button`}
                >
                  <i className={`fas fa-sign-in-alt text-xl ${isLoading ? 'hidden' : ''}`}></i>
                  <span>{isLoading ? '加入中...' : '加入会议'}</span>
                  <i className={`fas fa-spinner ${styles.loadingSpinner} text-xl ${isLoading ? '' : 'hidden'}`}></i>
                </button>

                {/* 返回按钮 */}
                <button 
                  type="button" 
                  onClick={handleBackClick}
                  className="w-full h-10 bg-gray-100 text-text-secondary rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>返回
                </button>
              </form>
            </div>

            {/* 提示信息 */}
            <div className="mt-8 text-center">
              <div className={`${styles.glassEffect} rounded-xl p-4 shadow-card`}>
                <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center justify-center">
                  <i className="fas fa-lightbulb text-warning mr-2"></i>
                  使用提示
                </h3>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li>• 房间号码为四位数数字（0000-9999）</li>
                  <li>• 请确保房间号码正确，否则无法加入会议</li>
                  <li>• 加入后将实时接收翻译音频和字幕</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinMeetingPage;

