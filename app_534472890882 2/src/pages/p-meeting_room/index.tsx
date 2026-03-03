

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface SubtitleItem {
  id: number;
  time: string;
  original: string;
  translated: string;
  status: 'playing' | 'played';
}

const MeetingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL参数
  const roomNumber = searchParams.get('roomNumber') || '1234';
  const userRole = searchParams.get('userRole') || 'host';
  
  // 状态管理
  const [meetingDuration, setMeetingDuration] = useState('00:05:32');
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    {
      id: 1,
      time: '00:01:23',
      original: 'Hello, welcome to our meeting today. I\'m very glad to see everyone here.',
      translated: '你好，欢迎参加我们今天的会议。我很高兴看到大家都在这里。',
      status: 'played'
    },
    {
      id: 2,
      time: '00:01:35',
      original: 'Today we\'re going to discuss the new product launch strategy for the upcoming quarter.',
      translated: '今天我们将讨论下一季度的新产品发布策略。',
      status: 'played'
    },
    {
      id: 3,
      time: '00:02:10',
      original: 'I think we need to focus on digital marketing channels to reach our target audience.',
      translated: '我认为我们需要专注于数字营销渠道来触达我们的目标受众。',
      status: 'played'
    },
    {
      id: 4,
      time: '00:03:45',
      original: 'The budget allocation for this campaign should be carefully considered.',
      translated: '这次活动的预算分配需要仔细考虑。',
      status: 'played'
    },
    {
      id: 5,
      time: '00:05:12',
      original: 'Let\'s move on to the next agenda item: customer feedback analysis.',
      translated: '让我们进入下一个议程项目：客户反馈分析。',
      status: 'playing'
    }
  ]);
  
  const [subtitleCount, setSubtitleCount] = useState(5);
  
  // Refs
  const meetingStartTimeRef = useRef(Date.now() - (5 * 60 + 32) * 1000);
  const subtitleIntervalRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 会议进行中';
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  // 会议时长计时器
  useEffect(() => {
    const updateMeetingDuration = () => {
      const now = Date.now();
      const duration = Math.floor((now - meetingStartTimeRef.current) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      
      let timeString = '';
      if (hours > 0) {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      
      setMeetingDuration(timeString);
    };
    
    updateMeetingDuration();
    durationIntervalRef.current = window.setInterval(updateMeetingDuration, 1000);
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);
  
  // 字幕自动更新（仅房主）
  useEffect(() => {
    if (userRole === 'host') {
      const addNewSubtitle = () => {
        if (isMuted) return;
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const mockSubtitles = [
          {
            original: 'Let\'s discuss the timeline for the project implementation.',
            translated: '让我们讨论项目实施的时间表。'
          },
          {
            original: 'We need to ensure that all team members are on the same page.',
            translated: '我们需要确保所有团队成员都达成共识。'
          },
          {
            original: 'The deadline for this phase is the end of next month.',
            translated: '这个阶段的截止日期是下个月底。'
          },
          {
            original: 'Communication is key to the success of this project.',
            translated: '沟通是这个项目成功的关键。'
          }
        ];
        
        const randomSubtitle = mockSubtitles[Math.floor(Math.random() * mockSubtitles.length)];
        const newSubtitleId = subtitleCount + 1;
        
        setSubtitles(prevSubtitles => {
          // 将之前的"正在播放"状态改为"已播放"
          const updatedSubtitles = prevSubtitles.map(subtitle => 
            subtitle.status === 'playing' ? { ...subtitle, status: 'played' } : subtitle
          );
          
          // 添加新的字幕
          return [...updatedSubtitles, {
            id: newSubtitleId,
            time: timeString,
            original: randomSubtitle.original,
            translated: randomSubtitle.translated,
            status: 'playing'
          }];
        });
        
        setSubtitleCount(prev => prev + 1);
      };
      
      subtitleIntervalRef.current = window.setInterval(addNewSubtitle, 30000);
    }
    
    return () => {
      if (subtitleIntervalRef.current) {
        clearInterval(subtitleIntervalRef.current);
      }
    };
  }, [userRole, isMuted, subtitleCount]);
  
  // 滚动字幕容器到底部
  useEffect(() => {
    if (subtitleContainerRef.current) {
      subtitleContainerRef.current.scrollTop = subtitleContainerRef.current.scrollHeight;
    }
  }, [subtitles]);
  
  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmModal) {
        setShowConfirmModal(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showConfirmModal]);
  
  // 显示确认对话框
  const handleShowConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ title, message, onConfirm });
    setShowConfirmModal(true);
  };
  
  // 静音/取消静音
  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };
  
  // 结束会议
  const handleEndMeeting = () => {
    handleShowConfirmModal(
      '确认结束会议',
      '确定要结束当前会议吗？所有参会者将被移出会议。',
      () => {
        console.log('结束会议');
        navigate('/meeting-select');
      }
    );
  };
  
  // 退出会议
  const handleLeaveMeeting = () => {
    handleShowConfirmModal(
      '确认退出会议',
      '确定要退出当前会议吗？',
      () => {
        console.log('退出会议');
        navigate('/meeting-select');
      }
    );
  };
  
  // 退出登录
  const handleLogout = () => {
    handleShowConfirmModal(
      '确认退出登录',
      '确定要退出登录吗？将离开当前会议。',
      () => {
        console.log('退出登录');
        navigate('/login');
      }
    );
  };
  
  // 关闭模态框
  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };
  
  // 点击模态框背景关闭
  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowConfirmModal(false);
    }
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
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">会议进行中</h2>
            <div className="flex items-center justify-center space-x-4 text-white/80">
              <div className="flex items-center space-x-2">
                <i className="fas fa-hashtag"></i>
                <span>房间号: {roomNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock"></i>
                <span>{meetingDuration}</span>
              </div>
            </div>
          </div>

          {/* 音频状态显示区 */}
          <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card mb-8 max-w-2xl mx-auto`}>
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-4 h-4 bg-success rounded-full ${styles.audioIndicator} ${isMuted ? styles.muted : ''}`}></div>
              <div className="text-center">
                <div className="text-lg font-semibold text-text-primary">
                  {isMuted ? '已静音' : userRole === 'host' ? '收音中' : '接收中'}
                </div>
                <div className="text-sm text-text-secondary">
                  {isMuted ? '麦克风已关闭' : userRole === 'host' ? '向火山引擎同传服务推流中' : '接收翻译音频和字幕'}
                </div>
              </div>
              {isMuted && (
                <div className="w-8 h-8 bg-danger rounded-full flex items-center justify-center">
                  <i className="fas fa-microphone-slash text-white text-sm"></i>
                </div>
              )}
            </div>
          </div>

          {/* 翻译字幕区 */}
          <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card mb-8 max-w-4xl mx-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center">
                <i className="fas fa-closed-captioning text-info mr-2"></i>
                实时翻译字幕
              </h3>
              <div className="text-sm text-text-secondary">
                <i className="fas fa-sync-alt mr-1"></i>
                <span>已生成 {subtitleCount} 条字幕</span>
              </div>
            </div>
            
            <div 
              ref={subtitleContainerRef}
              className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3"
            >
              {subtitles.map((subtitle) => (
                <div key={subtitle.id} className={`${styles.subtitleItem} bg-white rounded-lg p-3 shadow-sm`}>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                    <span>{subtitle.time}</span>
                    <span className="flex items-center space-x-1">
                      <i className={`fas ${subtitle.status === 'playing' ? 'fa-play text-primary' : 'fa-volume-up text-success'}`}></i>
                      <span>{subtitle.status === 'playing' ? '正在播放' : '已播放'}</span>
                    </span>
                  </div>
                  <p className="text-text-primary">{subtitle.original}</p>
                  <p className="text-text-secondary mt-1">{subtitle.translated}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 会议控制按钮区 */}
          <div className="max-w-2xl mx-auto">
            {userRole === 'host' ? (
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={handleMuteToggle}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-button ${styles.buttonHover} ${
                    isMuted ? 'bg-gray-500 text-white' : 'bg-warning text-white'
                  }`}
                >
                  <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                  <span>{isMuted ? '取消静音' : '静音'}</span>
                </button>
                
                <button 
                  onClick={handleEndMeeting}
                  className={`px-8 py-3 bg-danger text-white rounded-xl font-semibold flex items-center space-x-2 shadow-button ${styles.buttonHover}`}
                >
                  <i className="fas fa-stop-circle"></i>
                  <span>结束会议</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button 
                  onClick={handleLeaveMeeting}
                  className={`px-8 py-3 bg-danger text-white rounded-xl font-semibold flex items-center space-x-2 shadow-button ${styles.buttonHover}`}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>退出会议</span>
                </button>
              </div>
            )}
          </div>

          {/* 会议信息卡片 */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <i className="fas fa-info-circle text-info mr-2"></i>
                会议信息
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-user-friends text-primary text-xl"></i>
                  </div>
                  <div className="text-text-secondary">参会人数</div>
                  <div className="font-semibold text-text-primary">3人</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-language text-success text-xl"></i>
                  </div>
                  <div className="text-text-secondary">翻译语言</div>
                  <div className="font-semibold text-text-primary">中英互译</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-wifi text-info text-xl"></i>
                  </div>
                  <div className="text-text-secondary">延迟</div>
                  <div className="font-semibold text-text-primary">0.5秒</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 确认对话框 */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleModalBackgroundClick}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{modalConfig.title}</h3>
              <p className="text-text-secondary mb-6">{modalConfig.message}</p>
              <div className="flex space-x-3">
                <button 
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    modalConfig.onConfirm();
                    setShowConfirmModal(false);
                  }}
                  className="flex-1 py-2 px-4 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomPage;

