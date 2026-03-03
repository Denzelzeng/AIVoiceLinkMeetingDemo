

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  email: string;
  name: string;
}

interface FormErrors {
  email: string;
  name: string;
  global: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    name: '',
    global: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showGlobalError, setShowGlobalError] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '译会通 - 登录';
    return () => { document.title = originalTitle; };
  }, []);

  // 邮箱验证正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 显示错误信息
  const showError = (field: keyof FormErrors, message: string) => {
    setFormErrors(prev => ({ ...prev, [field]: message }));
    if (field === 'email') setShowEmailError(true);
    else if (field === 'name') setShowNameError(true);
    else if (field === 'global') setShowGlobalError(true);
  };

  // 隐藏错误信息
  const hideError = (field: keyof FormErrors) => {
    if (field === 'email') setShowEmailError(false);
    else if (field === 'name') setShowNameError(false);
    else if (field === 'global') setShowGlobalError(false);
  };

  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  // 验证表单
  const validateForm = (): boolean => {
    let isValid = true;

    // 验证邮箱
    if (!formData.email.trim()) {
      showError('email', '请输入邮箱地址');
      isValid = false;
    } else if (!validateEmail(formData.email.trim())) {
      showError('email', '请输入有效的邮箱地址');
      isValid = false;
    } else {
      hideError('email');
    }

    // 验证姓名
    if (!formData.name.trim()) {
      showError('name', '请输入您的姓名');
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      showError('name', '姓名至少需要2个字符');
      isValid = false;
    } else {
      hideError('name');
    }

    // 隐藏全局错误
    hideError('global');

    return isValid;
  };

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 实时验证
    if (field === 'email' && value.trim()) {
      if (validateEmail(value.trim())) {
        hideError('email');
      } else {
        showError('email', '请输入有效的邮箱地址');
      }
    } else if (field === 'email' && !value.trim()) {
      hideError('email');
    }

    if (field === 'name' && value.trim()) {
      if (value.trim().length >= 2) {
        hideError('name');
      } else {
        showError('name', '姓名至少需要2个字符');
      }
    } else if (field === 'name' && !value.trim()) {
      hideError('name');
    }
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    // 设置加载状态
    setIsLoading(true);

    // 模拟登录过程
    setTimeout(() => {
      try {
        const email = formData.email.trim();
        const name = formData.name.trim();

        // 保存用户信息到localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', name);
        }

        // 跳转到会议选择页面
        navigate('/meeting-select');
      } catch (error) {
        console.error('登录过程中出错:', error);
        showError('global', '登录失败，请重试');
        setIsLoading(false);
      }
    }, 1500);
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent, nextField?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        nextField();
      } else {
        handleSubmit(e);
      }
    }
  };

  // 自动聚焦到邮箱输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      if (emailInput) {
        emailInput.focus();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <main className={`${styles.mainContent} flex items-center justify-center`}>
        <div className="w-full max-w-md mx-auto px-6 py-12">
          <div className={styles.formContainer}>
            {/* Logo和产品名称 */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card">
                <i className="fas fa-language text-primary text-3xl"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">译会通</h1>
              <p className="text-lg text-white/80">实时同声传译，打破语言壁垒</p>
            </div>

            {/* 登录表单 */}
            <div className={`${styles.glassEffect} rounded-2xl p-8 shadow-form`}>
              <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">欢迎使用</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 邮箱输入框 */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                    <i className="fas fa-envelope text-primary mr-2"></i>邮箱地址
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      const nameInput = document.getElementById('name') as HTMLInputElement;
                      if (nameInput) nameInput.focus();
                    })}
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.inputFocus} text-text-primary placeholder-text-secondary`}
                    placeholder="请输入您的邮箱地址"
                    required
                    autoComplete="email"
                  />
                  {showEmailError && (
                    <div className="text-danger text-sm">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* 名称输入框 */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                    <i className="fas fa-user text-primary mr-2"></i>您的姓名
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
                      if (loginBtn) loginBtn.focus();
                    })}
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.inputFocus} text-text-primary placeholder-text-secondary`}
                    placeholder="请输入您的姓名"
                    required
                    autoComplete="name"
                  />
                  {showNameError && (
                    <div className="text-danger text-sm">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      <span>{formErrors.name}</span>
                    </div>
                  )}
                </div>

                {/* 全局错误提示 */}
                {showGlobalError && (
                  <div className={`text-danger text-sm text-center ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <span>{formErrors.global}</span>
                  </div>
                )}

                {/* 进入按钮 */}
                <button 
                  type="submit" 
                  id="login-btn" 
                  className={`w-full h-12 bg-primary text-white font-semibold rounded-xl ${styles.buttonHover} shadow-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading}
                  onKeyDown={handleKeyDown}
                >
                  <span>{isLoading ? '登录中...' : '进入'}</span>
                  {isLoading && (
                    <div className={styles.loadingSpinner}></div>
                  )}
                </button>
              </form>

              {/* 功能说明 */}
              <div className="mt-8 pt-6 border-t border-border-light">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="text-text-secondary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-bolt text-primary text-sm"></i>
                    </div>
                    <p>实时翻译</p>
                  </div>
                  <div className="text-text-secondary">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-check-circle text-success text-sm"></i>
                    </div>
                    <p>高准确率</p>
                  </div>
                  <div className="text-text-secondary">
                    <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-user-friends text-info text-sm"></i>
                    </div>
                    <p>简单易用</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 页脚信息 */}
            <div className="text-center mt-8 text-white/60 text-sm">
              <p>© 2024 译会通. 让沟通无界限</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

