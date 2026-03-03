

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState<number>(1234);
  const [isCopySuccess, setIsCopySuccess] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<boolean>(true);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 会议已创建';
    return () => { document.title = originalTitle; };
  }, []);

  // 生成四位数房间号码
  const generateRoomNumber = (): number => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  // 页面加载时生成房间号
  useEffect(() => {
    const newRoomNumber = generateRoomNumber();
    setRoomNumber(newRoomNumber);
  }, []);

  // 复制房间号功能
  const handleCopyRoomNumber = async () => {
    try {
      // 使用 Clipboard API 复制文本
      await navigator.clipboard.writeText(roomNumber.toString());
      setIsCopySuccess(true);
      
      setTimeout(() => {
        setIsCopySuccess(false);
      }, 2000);
    } catch (error) {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = roomNumber.toString();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setIsCopySuccess(true);
      setTimeout(() => {
        setIsCopySuccess(false);
      }, 2000);
    }
  };

  // 进入会议按钮点击事件
  const handleEnterMeeting = () => {
    navigate(`/meeting-room?roomNumber=${roomNumber}&role=host`);
  };

  // 退出按钮点击事件
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/login');
    }
  };

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const enterBtn = document.querySelector('#enter-meeting-btn') as HTMLButtonElement;
      const copyBtn = document.querySelector('#copy-room-number-btn') as HTMLButtonElement;
      const logoutBtn = document.querySelector('#logout-btn') as HTMLButtonElement;
      
      if (e.key === 'Enter' && document.activeElement === enterBtn) {
        handleEnterMeeting();
      } else if (e.key === 'Enter' && document.activeElement === copyBtn) {
        handleCopyRoomNumber();
      } else if (e.key === 'Enter' && document.activeElement === logoutBtn) {
        handleLogout();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [roomNumber]);

  // 为按钮添加焦点效果
  useEffect(() => {
    const handleButtonFocus = (e: FocusEvent) => {
      const button = e.target as HTMLButtonElement;
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
    };

    const handleButtonBlur = (e: FocusEvent) => {
      const button = e.target as HTMLButtonElement;
      button.style.transform = 'translateY(0)';
      if (button.id === 'enter-meeting-btn') {
        button.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
      } else {
        button.style.boxShadow = '';
      }
    };

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('focus', handleButtonFocus);
      button.addEventListener('blur', handleButtonBlur);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('focus', handleButtonFocus);
        button.removeEventListener('blur', handleButtonBlur);
      });
    };
  }, []);

  // 模拟向火山引擎同传服务推流的状态更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 这里可以添加实际的连接状态检测逻辑
      // 目前只是演示状态切换，保持连接状态
      setStreamStatus(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
              id="logout-btn"
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
            <h2 className="text-3xl font-bold text-white mb-4">会议已创建</h2>
            <p className="text-lg text-white/80">您的会议房间已准备就绪</p>
          </div>

          {/* 房间号显示区 */}
          <div className="text-center mb-8">
            <div className={`${styles.glassEffect} rounded-3xl p-8 shadow-room-number ${styles.roomNumberAnimation}`}>
              <div className="text-lg font-medium text-text-secondary mb-4">房间号</div>
              <div className="text-6xl font-bold text-primary mb-4">{roomNumber}</div>
              <button 
                id="copy-room-number-btn"
                onClick={handleCopyRoomNumber}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isCopySuccess 
                    ? 'bg-success/10 text-success' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <i className={`${isCopySuccess ? 'fas fa-check' : 'fas fa-copy'} mr-2`}></i>
                {isCopySuccess ? '已复制' : '复制房间号'}
              </button>
            </div>
          </div>

          {/* 状态信息区 */}
          <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card mb-8`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-4 h-4 rounded-full ${styles.statusIndicator} mr-3 ${
                streamStatus ? 'bg-success' : 'bg-danger'
              }`}></div>
              <h3 className="text-lg font-semibold text-text-primary">收音状态</h3>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-microphone text-success text-2xl"></i>
              </div>
              <p className="text-text-primary mb-2">
                {streamStatus ? '您的设备已作为收音设备' : '推流连接中断'}
              </p>
              <p className="text-sm text-text-secondary">正在向火山引擎同传服务推流麦克风音频</p>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="text-center">
            <button 
              id="enter-meeting-btn"
              onClick={handleEnterMeeting}
              className={`w-full max-w-md h-16 bg-primary text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-button mx-auto ${styles.buttonHover}`}
            >
              <i className="fas fa-video text-2xl"></i>
              <span>进入会议</span>
            </button>
          </div>

          {/* 参会者指南 */}
          <div className="mt-8 max-w-md mx-auto">
            <div className={`${styles.glassEffect} rounded-xl p-4 shadow-card`}>
              <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
                <i className="fas fa-info-circle text-info mr-2"></i>
                参会者指南
              </h4>
              <div className="text-xs text-text-secondary space-y-2">
                <p>• 告知其他参会者房间号：<span className="font-medium text-primary">{roomNumber}</span></p>
                <p>• 参会者访问译会通并选择"加入会议"</p>
                <p>• 输入房间号即可加入会议</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

