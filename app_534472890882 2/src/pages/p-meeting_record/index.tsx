

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface MeetingRecord {
  id: string;
  title: string;
  roomNumber: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
}

interface SubtitleItem {
  time: string;
  text: string;
}

const MeetingRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [meetingRecords] = useState<MeetingRecord[]>([
    {
      id: 'meeting-001',
      title: '2024年1月15日 会议',
      roomNumber: '1234',
      startTime: '14:30',
      endTime: '15:45',
      duration: '1小时15分钟',
      status: '已结束'
    },
    {
      id: 'meeting-002',
      title: '2024年1月12日 会议',
      roomNumber: '5678',
      startTime: '10:00',
      endTime: '11:20',
      duration: '1小时20分钟',
      status: '已结束'
    },
    {
      id: 'meeting-003',
      title: '2024年1月10日 会议',
      roomNumber: '9012',
      startTime: '16:15',
      endTime: '17:30',
      duration: '1小时15分钟',
      status: '已结束'
    },
    {
      id: 'meeting-004',
      title: '2024年1月8日 会议',
      roomNumber: '3456',
      startTime: '13:00',
      endTime: '14:15',
      duration: '1小时15分钟',
      status: '已结束'
    },
    {
      id: 'meeting-005',
      title: '2024年1月5日 会议',
      roomNumber: '7890',
      startTime: '09:30',
      endTime: '10:45',
      duration: '1小时15分钟',
      status: '已结束'
    }
  ]);

  const meetingSubtitles: Record<string, SubtitleItem[]> = {
    'meeting-001': [
      { time: '14:30:15', text: 'Hello everyone, welcome to today\'s meeting.' },
      { time: '14:30:18', text: '大家好，欢迎参加今天的会议。' },
      { time: '14:30:25', text: 'First, let\'s discuss our quarterly goals.' },
      { time: '14:30:28', text: '首先，让我们讨论我们的季度目标。' },
      { time: '14:30:35', text: 'We need to increase our sales by 20% this quarter.' },
      { time: '14:30:38', text: '我们本季度需要将销售额提高20%。' },
      { time: '14:30:45', text: 'What strategies do we have in place?' },
      { time: '14:30:48', text: '我们有什么策略？' },
      { time: '14:30:55', text: 'We can focus on digital marketing and customer retention.' },
      { time: '14:30:58', text: '我们可以专注于数字营销和客户保留。' },
      { time: '14:31:05', text: 'That sounds good. Let\'s break it down into action items.' },
      { time: '14:31:08', text: '听起来不错。让我们将其分解为行动项目。' }
    ],
    'meeting-002': [
      { time: '10:00:10', text: 'Good morning team, let\'s start the weekly sync.' },
      { time: '10:00:13', text: '早上好团队，让我们开始每周同步。' },
      { time: '10:00:20', text: 'How is the project进展 going?' },
      { time: '10:00:23', text: '项目进展如何？' },
      { time: '10:00:30', text: 'We are on track for the deadline.' },
      { time: '10:00:33', text: '我们按计划进行，能按时完成。' }
    ],
    'meeting-003': [
      { time: '16:15:05', text: 'Let\'s review the budget for next quarter.' },
      { time: '16:15:08', text: '让我们回顾下一季度的预算。' }
    ],
    'meeting-004': [
      { time: '13:00:12', text: 'Welcome to the product review meeting.' },
      { time: '13:00:15', text: '欢迎参加产品评审会议。' }
    ],
    'meeting-005': [
      { time: '09:30:08', text: 'Let\'s discuss the new marketing campaign.' },
      { time: '09:30:11', text: '让我们讨论新的营销活动。' }
    ]
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 会议记录';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDetailView && e.key === 'Escape') {
        handleBackToList();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDetailView]);

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/login');
    }
  };

  const handleRecordItemClick = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedMeetingId('');
  };

  const getSelectedMeeting = () => {
    return meetingRecords.find(record => record.id === selectedMeetingId);
  };

  const getSubtitlesForMeeting = () => {
    return meetingSubtitles[selectedMeetingId] || [];
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">会议记录</h2>
            <p className="text-lg text-white/80">查看历史会议的翻译记录和时间信息</p>
          </div>

          {/* 会议记录列表视图 */}
          {!isDetailView && (
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card`}>
              {/* 列表标题 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                  <i className="fas fa-list text-info mr-3"></i>
                  会议记录列表
                </h3>
                <div className="text-sm text-text-secondary">
                  共 <span>{meetingRecords.length}</span> 条记录
                </div>
              </div>

              {/* 会议记录列表 */}
              <div className="space-y-3">
                {meetingRecords.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleRecordItemClick(record.id)}
                    className={`${styles.recordItem} bg-white rounded-lg p-4 cursor-pointer border border-gray-100`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRecordItemClick(record.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-video text-primary text-lg"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{record.title}</h4>
                          <p className="text-sm text-text-secondary">
                            房间号: {record.roomNumber} | 开始时间: {record.startTime}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            结束时间: {record.endTime} | 时长: {record.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                          {record.status}
                        </span>
                        <i className="fas fa-chevron-right text-text-secondary"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 会议详情视图 */}
          {isDetailView && (
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-card mt-6`}>
              {/* 详情标题栏 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                  <i className="fas fa-file-alt text-info mr-3"></i>
                  会议详情
                </h3>
                <button 
                  onClick={handleBackToList}
                  className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>返回列表</span>
                </button>
              </div>

              {/* 会议基本信息 */}
              {getSelectedMeeting() && (
                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-calendar text-primary text-lg"></i>
                      </div>
                      <h4 className="font-medium text-text-primary mb-1">会议日期</h4>
                      <p className="text-sm text-text-secondary">
                        {getSelectedMeeting()?.title.replace(' 会议', '')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-hashtag text-primary text-lg"></i>
                      </div>
                      <h4 className="font-medium text-text-primary mb-1">房间号</h4>
                      <p className="text-sm text-text-secondary">
                        {getSelectedMeeting()?.roomNumber}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-clock text-primary text-lg"></i>
                      </div>
                      <h4 className="font-medium text-text-primary mb-1">会议时长</h4>
                      <p className="text-sm text-text-secondary">
                        {getSelectedMeeting()?.duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 翻译字幕内容 */}
              <div className="bg-white rounded-lg p-6 border border-gray-100">
                <h4 className="font-semibold text-text-primary mb-4 flex items-center">
                  <i className="fas fa-closed-captioning text-info mr-2"></i>
                  翻译字幕记录
                </h4>
                <div className={`${styles.detailContent} space-y-0`}>
                  {getSubtitlesForMeeting().length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">暂无字幕记录</div>
                  ) : (
                    getSubtitlesForMeeting().map((subtitle, index) => (
                      <div key={index} className={styles.subtitleItem}>
                        <div className="flex items-start space-x-4">
                          <div className="w-16 text-sm text-text-secondary font-mono flex-shrink-0">
                            {subtitle.time}
                          </div>
                          <div className="flex-1">
                            <p className="text-text-primary leading-relaxed">
                              {subtitle.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MeetingRecordPage;

