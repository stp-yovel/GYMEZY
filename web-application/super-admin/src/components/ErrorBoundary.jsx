import React from 'react';
import { Button, Result } from 'antd';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Super Admin ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.href = '/admin/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 640,
              width: '100%',
              backgroundColor: '#1e293b',
              borderRadius: 16,
              padding: 32,
              border: '1px solid #334155',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f87171', margin: '0 0 12px 0' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
              {this.state.error?.message || 'An unexpected rendering error occurred in the Super Admin console.'}
            </p>
            {this.state.errorInfo && (
              <pre
                style={{
                  textAlign: 'left',
                  backgroundColor: '#090d16',
                  color: '#fca5a5',
                  padding: 16,
                  borderRadius: 8,
                  fontSize: 12,
                  maxHeight: 200,
                  overflow: 'auto',
                  marginBottom: 24,
                }}
              >
                {this.state.error?.stack}
              </pre>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button type="primary" onClick={this.handleReload} style={{ backgroundColor: '#4338ca', fontWeight: 700 }}>
                Return to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
