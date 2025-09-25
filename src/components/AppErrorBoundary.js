import React from 'react';

// Lightweight runtime error boundary so a render crash doesn't leave a black screen.
export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    try { console.error('[AppErrorBoundary] Caught error', error, info); } catch(_) {}
    this.setState({ info });
  }
  handleReload = () => {
    try { sessionStorage.removeItem('spa-chunk-reload'); } catch(_) {}
    window.location.reload();
  };
  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '40px 28px',
          color: '#f1f5f9',
          background: 'radial-gradient(circle at 50% 20%, #2a2e5a 0%, #14162c 80%)',
          minHeight: '100vh'
        }}>
          <h1 style={{margin:0,fontSize:34,fontWeight:700,letterSpacing:'.5px'}}>Something went wrong</h1>
          <p style={{opacity:.8, maxWidth:640, lineHeight:1.4}}>The application hit an unexpected error while rendering. A reload often fixes transient bundle or network issues. If it keeps happening, copy the details below when reporting.</p>
          <div style={{background:'#1e223f',border:'1px solid #303861',borderRadius:8,padding:'16px 18px',maxWidth:900,overflow:'auto'}}>
            <pre style={{margin:0,fontSize:12,lineHeight:1.5,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{String(error && (error.stack || error.message || error))}</pre>
          </div>
          <button onClick={this.handleReload} style={{marginTop:24,background:'#2563eb',color:'#fff',border:0,padding:'10px 20px',borderRadius:6,fontWeight:600,cursor:'pointer'}}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
